import { z } from "zod";

export const positionSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  experience: z.string().optional(),
  numberOfOpenings: z.number().min(1, "At least one position is required"),
  description: z
    .string()
    .min(1, "Job description is required")
    .max(200, "description should not be more than 200 words."),
});
