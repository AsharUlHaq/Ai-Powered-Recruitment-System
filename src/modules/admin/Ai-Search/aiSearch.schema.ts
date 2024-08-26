import { z } from "zod";

export const aiSchema = z.object({
  applicantId: z.number().int(),
  jobDescription: z.string(),
  resumeBase64: z.string(),
});
