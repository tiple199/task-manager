import { isEmailExists } from "@/services/auth.service";
import z from "zod";
const emailSchema = z.email("Invalid email format.")
.refine( async (email) => {
    const existingUser = await isEmailExists(email);
    return !existingUser;
},{
    error: "Email already exists.",
    path: ["email"]
});

const passwordSchema = z.string().min(8, "Password must be at least 8 characters long.")
.max(20, "Password must be at most 20 characters long.")
.regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
.regex(/[a-z]/, "Password must contain at least one lowercase letter.")
.regex(/[0-9]/, "Password must contain at least one number.")

export const registerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters long.").max(50, "Full name must be at most 50 characters long."),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"]
});

export const loginSchema = z.object({
    email: z.email("Invalid email format."),
    password: z.string().min(1, "Password is required.")
});

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TRegisterSchema = z.infer<typeof registerSchema>;