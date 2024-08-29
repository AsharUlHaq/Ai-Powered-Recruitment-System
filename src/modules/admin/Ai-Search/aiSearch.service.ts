import axios from "axios";
import prisma from "../../../utils/db.util";
import { ENV } from "../../../utils/env.util";

const FLASK_SERVER: string = ENV.FLASK_SERVER_URL as string;

export async function calculateMatchScore(
  jobDescription: string,
  resumeBase64: string
): Promise<number> {
  try {
    const response = await axios.post(FLASK_SERVER, {
      JobDesc: jobDescription,
      ResumeData: resumeBase64,
    });

    console.log("Flask server response:", response.data); // For debugging

    // Directly extract matchScore from response
    const matchScore = response.data.matchScore;

    // Check type and ensure it's a number
    if (typeof matchScore !== "number") {
      throw new Error(`Invalid match score type: ${typeof matchScore}`);
    }

    return matchScore;
  } catch (error: any) {
    console.error("Error communicating with Flask server:", error.message);
    throw new Error("Failed to calculate match score");
  }
}

// Function to update the applicant's match score in the database
export async function updateApplicantMatchScore(
  applicantId: number,
  matchScore: number
) {
  try {
    console.log(
      `Updating match score for applicant ${applicantId} to ${matchScore}`
    );
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { matchScore },
    });
  } catch (error: any) {
    console.error("Error updating match score:", error.message);
    throw new Error("Failed to update match score");
  }
}
