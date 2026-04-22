import { handleCreateToken, handleGoogleLogin, handleLogin, handleLogout, handleRefreshToken, handleUpdateUserNewPassword, registerNewUser, sendOTP } from "@/services/auth.service";
import AppError from "@/utils/appError";
import { registerSchema, TRegisterSchema,TLoginSchema, loginSchema, emailSchema, resetPasswordSchema, refreshTokenSchema } from "@/validation/auth.schema";
import { Request, Response } from "express";
import crypto from "crypto";
import { sendOTPEmail, sendResetPasswordEmail } from "@/utils/mailer";
import { delay } from "@/helper/helper";

const createUserAPI = async (req: Request, res: Response) => {
    const { fullName, email, password, confirmPassword, otp } = req.body as TRegisterSchema;
    const validation = await registerSchema.safeParseAsync({ fullName, email, password, confirmPassword,otp });
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

    await registerNewUser(fullName, email, password,otp);

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

const sendOTPAPI = async (req: Request, res: Response) => {
    const validation = await emailSchema.safeParseAsync(req.body.email);
    if(!validation.success) {
        const errorZod = validation.error.issues;
        const firstErrors = errorZod
            .map((err) => ({
                field: String(err.path[0] ?? "general"),
                message: err.message
            }));
        throw new AppError("Validation failed.", 400, firstErrors);
    }

    const result = await sendOTP(validation.data);



    // gửi mail
    sendOTPEmail(validation.data, result.token);

    await delay(2000);

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully."
    });
}

const googleLogin = async (req: Request, res: Response) => {
    const { idToken } = req.body;
    if (!idToken || typeof idToken !== "string") {
        throw new AppError("Invalid or missing idToken.", 400, [{ field: "idToken", message: "idToken is required and must be a string." }]);
    }

    const result = await handleGoogleLogin(idToken);

    return res.status(201).json(result);

}

const handleForgotPassword = async (req: Request, res: Response) => {
    const validation = await emailSchema.safeParseAsync(req.body.email);
    if(!validation.success) {
        const errorZod = validation.error.issues;
        const firstErrors = errorZod
            .map((err) => ({
                field: String(err.path[0] ?? "general"),
                message: err.message
            }));
        throw new AppError("Validation failed.", 400, firstErrors);
    }

    const token = crypto.randomBytes(32).toString("hex");

    const result = await handleCreateToken(validation.data, token);

    await sendResetPasswordEmail(validation.data, token);

    return res.status(200).json({
        success: true,
        message: "Password reset token generated successfully.",
        data: {
            email: validation.data,
            expires: result.expiresAt
        }
    });




}

const handleResetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const validation = await resetPasswordSchema.safeParseAsync(req.body);
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

    if (!token) {
        throw new AppError("Missing token.", 400, [{ field: "token", message: "Token is required." }]);
    }

    await handleUpdateUserNewPassword(token as string, validation.data.password);

    return res.status(200).json({
        success: true,
        message: "Password reset successfully."
    });
}

const refreshTokenController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const validation = await refreshTokenSchema.safeParseAsync(refreshToken);
    if(!validation.success) {
        const errorZod = validation.error.issues;
        const firstErrors = errorZod            .map((err) => ({
                field: String(err.path[0] ?? "general"),
                message: err.message
            }));
        throw new AppError("Validation failed.", 400, firstErrors);
    }

    const result = await handleRefreshToken(refreshToken);

    return res.status(200).json({
        success: true,
        message: "Token refreshed successfully.",
        data: {
            accessToken: result.accessToken
        }
    });
}

const logoutController = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const {refreshToken} = req.body;
    const validation = await refreshTokenSchema.safeParseAsync(refreshToken);
    if(!validation.success) {
        const errorZod = validation.error.issues;
        const firstErrors = errorZod            .map((err) => ({
                field: String(err.path[0] ?? "general"),
                message: err.message
            }));
        throw new AppError("Validation failed.", 400, firstErrors);
    }
    await handleLogout(+userId!,refreshToken);
    

  return res.status(200).json({
    success: true,
    message: "Logged out successfully."
  });
};



export { createUserAPI,loginAPI,sendOTPAPI,googleLogin,
    handleForgotPassword,handleResetPassword,refreshTokenController,logoutController };