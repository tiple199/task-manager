import { prisma } from "@/config/prisma"
import AppError from "@/utils/appError";
import { sendOTPEmail } from "@/utils/mailer";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";


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
    const otpRecord = await prisma.oTP.findFirst({
        where: {
            email,
            code: otp,
            expiresAt: {
                gt: new Date()
            }
        }
    });
    if (!otpRecord) {
        throw new AppError("Invalid or expired OTP.", 400, [{field: "otp", message: "Invalid or expired OTP."}]);
    }


    
    const hashedPassword = await hashPassword(password);

    await prisma.oTP.deleteMany({
        where: {
            email
        }
    });
    
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
    const secretKey: string = process.env.JWT_SECRET!;
    const expiresIn: any = process.env.JWT_EXPIRES_IN;
    const accessToken = jwt.sign(payload,secretKey,{expiresIn: expiresIn});
    return accessToken;


}

const sendOTP = async (email: string) => {

    const emailExists = await isEmailExists(email);
    if(emailExists) {
        throw new AppError("Email already exists.", 400, [{field: "email", message: "Email already exists."}]);
    }

  // tạo OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.oTP.create({
    data: {
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 phút
    }
  });

  // gửi mail
  await sendOTPEmail(email, otp);

  return { message: "OTP sent to email" };
};

const handleCleanOTPs = async () => {
    const result = prisma.oTP.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });
    
    return result;
}



export { isEmailExists, registerNewUser, hashPassword,handleLogin, comparePassword,sendOTP,handleCleanOTPs }