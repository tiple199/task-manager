import z from "zod";

export const taskQuerySchema = z.object({
    search: z.string().trim().max(100, "Search query must be at most 100 characters long.").optional(),
    status: z.enum(["pending", "in_progress", "completed"], "Invalid status value.").optional(),
    priority: z.enum(["low", "medium", "high"], "Invalid priority value.").optional(),
    page: z.coerce.number().int().positive("Page must be a positive integer.").optional().default(1),
    limit: z.coerce.number().int().positive("Limit must be a positive integer.").optional().default(10),
    sort: z
    .enum(["deadline", "-deadline", "priority", "-priority"])
    .optional()
    .transform((value) => {
      if (!value) return undefined;

      const direction = value.startsWith("-") ? "desc" : "asc";
      const field = value.startsWith("-")
        ? value.slice(1)
        : value;

      return {
        [field]: direction
      };
    })
});

export type TTaskQuerySchema = z.infer<typeof taskQuerySchema>;