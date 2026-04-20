import { prisma } from "@/config/prisma"
import { generateToken } from "@/helper/helper";
import AppError from "@/utils/appError";
import bcrypt, { compare } from "bcrypt";
import { OAuth2Client } from "google-auth-library";


const saltRounds = 10;
const hashPassword = async (planText: string) => {
    return await bcrypt.hash(planText, saltRounds);
}

const comparePassword = async (planText: string, hashed: string) => {
    return await compare(planText, hashed);
}

const isEmailExists = async (email: string) => {
    const emailExists = await prisma.user.findUnique({
        where: {
            email
        }
    });
    return !!emailExists;
}

const registerNewUser = async (fullName: string, email: string, password: string,otp: string) => {

    const emailExists = await isEmailExists(email);
    if(emailExists) {
        throw new AppError("Email already exists.", 400, [{field: "email", message: "Email already exists."}]);
    }
    const otpRecord = await prisma.authToken.findFirst({
        where: {
            email,
            token: otp,
            isUsed: false,
            type: "verify_email",
            expiresAt: {
                gt: new Date()
            }
        }
    });
    if (!otpRecord) {
        throw new AppError("Invalid or expired OTP.", 400, [{field: "otp", message: "Invalid or expired OTP."}]);
    }

    await prisma.authToken.update({
        where: {
            id: otpRecord.id
        },
        data: {
            isUsed: true
        }
    });


    
    const hashedPassword = await hashPassword(password);
    
    const newUser = await prisma.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
            isVerified: true
        }
    });

    
    
    return newUser;
}

const handleLogin = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new AppError("Invalid email or password.",401);
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
        throw new AppError("Invalid email or password.",401);
    }
    const payload = {
        userId: user.id,
        email: user.email
    }
    const accessToken = generateToken(payload);
    return accessToken;


}

// function rate limit
const handleRateLimit = async (email: string,token: string,time: number,type: string) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const count = await prisma.authToken.count({
      where: {
        email,
        type: type,
        createdAt: {
          gte: oneHourAgo
        }
      }
    });

    if (count >= 5) {
      throw new AppError("Too many password reset requests. Please try again later.", 429);
    }

    const latest = await prisma.authToken.findFirst({
        where: {
          email,
          type: type
        },
        orderBy: {
          createdAt: "desc"
        }
    });

    if (
        latest &&
        Date.now() - new Date(latest.createdAt).getTime() < 60000
    ) {
       throw new AppError("Wait 60 seconds", 429);
    }

    await prisma.authToken.updateMany({
        where: {
            email,
            type: type,
            isUsed: false
        },
        data: {
            isUsed: true
        }
    });

    const result = await prisma.authToken.create({
        data: {
            token: token,
            type: type,
            email,
            expiresAt: new Date(Date.now() + time * 60 * 1000)
        },
        select: {
            expiresAt: true,
            token: true
        }
        
    });

    return result;
}

const sendOTP = async (email: string) => {

    const emailExists = await isEmailExists(email);
    if(emailExists) {
        throw new AppError("Email already exists.", 400, [{field: "email", message: "Email already exists."}]);
    }

  // tạo OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const time = +process.env.TIME_LiMIT_OTP!;

    const result = handleRateLimit(email, otp, time,"verify_email");

  

  return result;
};

const handleCleanOTPs = async () => {
    const result = prisma.authToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });
    
    return result;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handleGoogleLogin = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  const email = payload?.email;
  const fullName = payload?.name;
  const googleId = payload?.sub;
  const avatar = payload?.picture;
  if (!email || !fullName || !googleId) {
    throw new AppError("Google login failed: missing required user information.", 400);
  }

  let user = await prisma.user.findUnique({
    where: { email },
    select: {
        id: true,
        email: true,
        fullName: true,
        googleId: true,
        avatar: true,
        provider: true
    }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        fullName,
        password: "", // No password for Google accounts
        googleId,
        avatar,
        provider: "google",
        isVerified: true
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        googleId: true,
        avatar: true,
        provider: true
      }
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
        googleId,
        provider: "google"
    }
  });
  const payloadToken = {
    userId: user.id,
    email: user.email
}

  const token = generateToken(payloadToken);

  return {
    message: "Google login success",
    token,
    user
  };
};

const handleCreateToken = async (email: string, token: string) => {
    const existEmail = await isEmailExists(email);

    if (!existEmail) {
        throw new AppError("User not found.", 404);
    }
    const time = Number(process.env.RATE_LIMIT_FORGOT_PASSWORD)!;
    const result = await handleRateLimit(email, token, time,"forgot_password");

    
    return result;

}

const handleUpdateUserNewPassword = async (token: string, newPassword: string) => {
    const result = await prisma.authToken.findFirst({
        where: {
            isUsed: false,
            type: "forgot_password",
            token: token,
            expiresAt: {
                gt: new Date()
            }
        }
    });

    if (!result) {
        throw new AppError("Invalid or expired token.", 400);
    }
    await prisma.authToken.update({
        where: {
            id: result.id
        },        data: {
            isUsed: true
        }
    });

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: {
            email: result.email
        },
        data: {
            password: hashedPassword,
        }
    });
}


export { isEmailExists, registerNewUser, hashPassword,handleLogin,
     comparePassword,sendOTP,handleCleanOTPs,handleGoogleLogin,handleCreateToken,handleUpdateUserNewPassword }