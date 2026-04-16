import { handleLogin, registerNewUser } from "@/services/auth.service";
import AppError from "@/utils/appError";
import { registerSchema, TRegisterSchema,TLoginSchema, loginSchema } from "@/validation/auth.schema";
import { Request, Response } from "express";
const createUserAPI = async (req: Request, res: Response) => {
    const { fullName, email, password, confirmPassword } = req.body as TRegisterSchema;
    const validation = await registerSchema.safeParseAsync({ fullName, email, password, confirmPassword });
    if(!validation.success) {
        const errorZod = validation.error.issues;
        const seenFields = new Set<string>();
        const firstErrors = errorZod
            .filter((err) => {
                const field = String(err.path[0] ?? "general");
                if (seenFields.has(field)) return false;
                seenFields.add(field);
                return true;
            })
            .map((err) => ({
                field: String(err.path[0] ?? "general"),
                message: err.message
            }));

        throw new AppError("Validation failed.", 400, firstErrors);
    }

    await registerNewUser(fullName, email, password);

    return res.status(201).json({
        success: true,
        message: "User registered successfully."
    });
}

const loginAPI = async (req: Request, res: Response) => {
    const { email, password } = req.body as TLoginSchema;
    const validation = await loginSchema.safeParseAsync({ email, password });
    if(!validation.success) {
        const errorZod = validation.error.issues;
        const seenFields = new Set<string>();
        const firstErrors = errorZod
            .filter((err) => {
                const field = String(err.path[0] ?? "general");
                if (seenFields.has(field)) return false;
                seenFields.add(field);
                return true;
            })
            .map((err) => ({
                field: String(err.path[0] ?? "general"),
                message: err.message
            }));
        throw new AppError("Validation failed.", 400, firstErrors);
    }


        const accessToken = await handleLogin(email, password);
        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {accessToken}
        });
}

export { createUserAPI,loginAPI }