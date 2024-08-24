import { z } from "zod";

export const positionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  experience: z.string().optional(),
  numberOfOpenings: z.number().min(1, "At least one position is required"),
});
