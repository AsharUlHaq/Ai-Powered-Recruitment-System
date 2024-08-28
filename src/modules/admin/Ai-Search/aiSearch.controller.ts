// aiSearch.controller.ts
import { Request, Response } from "express";
import { calculateMatchScore } from "./aiSearch.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function evaluateApplicant(req: Request, res: Response) {
  try {
    const { applicantId, jobDescription, resumeBase64 } = req.body;

    if (!applicantId || !jobDescription || !resumeBase64) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const matchScore = await calculateMatchScore(jobDescription, resumeBase64);

    // Update the applicant's match score in the database
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { matchScore },
    });

    return res.status(200).json({
      status: 200,
      message: "Match score calculated and updated successfully",
      data: { matchScore },
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      status: 400,
      message: "An error occurred while evaluating the applicant.",
      data: null,
      success: false,
    });
  }
}
