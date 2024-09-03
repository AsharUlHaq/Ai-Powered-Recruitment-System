import { z } from "zod";

export const positionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(25, "Title should not be more than 25 characters"),
  experience: z.number().max(2).optional(),
  numberOfOpenings: z
    .number()
    .min(1, "At least one position is required")
    .max(2),
  description: z
    .string()
    .min(1, "Job description is required")
    .max(1000, "description should not be more than 1000 words."),
});
