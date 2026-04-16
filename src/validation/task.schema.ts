import { isTodayOrFuture } from "@/helper/helper";
import z from "zod";

export const taskSchema = z.object({
    title: z.string().min(1, "Title is required.").max(100, "Title must be at most 100 characters long."),
    description: z.string().max(500, "Description must be at most 500 characters long.").optional(),
    status: z.enum(["pending", "in_progress", "completed"], "Invalid status value.").optional(),
    priority: z.enum(["low", "medium", "high"], "Invalid priority value.").optional(),
    deadline: z.coerce.date().refine(isTodayOrFuture, {
        message: "Deadline must be today or in the future."
    })
});
export const updateTaskSchema = taskSchema.partial();

export type TTaskSchema = z.infer<typeof taskSchema>;
export type TUpdateTaskSchema = z.infer<typeof updateTaskSchema>;
