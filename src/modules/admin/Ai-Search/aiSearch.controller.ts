// aiSearch.controller.ts
import { Request, Response } from "express";
import {
  calculateMatchScore,
  updateApplicantMatchScoreAndInsights,
} from "./aiSearch.service";
import { aiSchema } from "./aiSearch.schema";
import { z } from "zod";

export async function evaluateApplicant(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = aiSchema.parse(req.body);
    const { applicantId, jobDescription, resumeBase64 } = validationResult;

    const { matchScore, insights } = await calculateMatchScore(
      jobDescription,
      resumeBase64
    );

    // Update the applicant's match score and insights in the database
    await updateApplicantMatchScoreAndInsights(
      applicantId,
      matchScore,
      insights
    );

    return res.status(200).json({
      status: 200,
      message: "Match score and insights calculated and updated successfully",
      data: { matchScore, insights },
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.errors.map((err: any) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }
    return res.status(400).json({
      status: 400,
      message: "An error occurred while evaluating the applicant.",
      data: null,
      success: false,
    });
  }
}
