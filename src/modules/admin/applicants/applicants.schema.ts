import { z } from "zod";

// Schema for searching applicants by position
export const findApplicantsByPositionSchema = z.object({
  positionId: z.number().int().positive(),
});

// Schema for AI-based search
export const aiBasedSearchSchema = z.object({
  positionId: z.number().int().positive(),
  numberOfCandidates: z.number().int().positive(),
});

// Schema for updating applicant status
export const updateApplicantStatusSchema = z.object({
  status: z.enum(["DRAFT", "HIRED", "REJECTED"]),
});
