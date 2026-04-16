import { prisma } from "@/config/prisma"
import AppError from "@/utils/appError";
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

const registerNewUser = async (fullName: string, email: string, password: string) => {

    const emailExists = await isEmailExists(email);
    if(emailExists) {
        throw new AppError("Email already exists.", 400, [{field: "email", message: "Email already exists."}]);
    }
    
    const hashedPassword = await hashPassword(password);
    
    const newUser = await prisma.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword
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



export { isEmailExists, registerNewUser, hashPassword,handleLogin, comparePassword }