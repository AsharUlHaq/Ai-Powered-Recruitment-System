// import axios from "axios";
// import prisma from "../../../utils/db.util";
// import { ENV } from "../../../utils/env.util";

// const FLASK_SERVER: string = ENV.FLASK_SERVER_URL as string;

// export async function calculateMatchScore(
//   jobDescription: string,
//   resumeBase64: string
// ): Promise<number> {
//   try {
//     const response = await axios.post(FLASK_SERVER, {
//       JobDesc: jobDescription,
//       ResumeData: resumeBase64,
//     });

//     console.log("Flask server response:", response.data); // For debugging

//     // Directly extract matchScore from response
//     const matchScore = response.data.matchScore;

//     // Check type and ensure it's a number
//     if (typeof matchScore !== "number") {
//       throw new Error(`Invalid match score type: ${typeof matchScore}`);
//     }

//     return matchScore;
//   } catch (error: any) {
//     console.error("Error communicating with Flask server:", error.message);
//     throw new Error("Failed to calculate match score");
//   }
// }

// // Function to update the applicant's match score in the database
// export async function updateApplicantMatchScore(
//   applicantId: number,
//   matchScore: number
// ) {
//   try {
//     console.log(
//       `Updating match score for applicant ${applicantId} to ${matchScore}`
//     );
//     await prisma.applicant.update({
//       where: { id: applicantId },
//       data: { matchScore },
//     });
//   } catch (error: any) {
//     console.error("Error updating match score:", error.message);
//     throw new Error("Failed to update match score");
//   }
// }

import axios from "axios";
import prisma from "../../../utils/db.util";
import { ENV } from "../../../utils/env.util";

const FLASK_SERVER: string = ENV.FLASK_SERVER_URL as string;

interface AIResponse {
  Insights: string;
  matchScore: number;
}

export async function calculateMatchScore(
  jobDescription: string,
  resumeBase64: string
): Promise<{ matchScore: number; insights: string }> {
  try {
    const response = await axios.post(`${FLASK_SERVER}`, {
      JobDesc: jobDescription,
      ResumeData: resumeBase64,
    });

    console.log("Flask server response:", response.data); // For debugging

    const data: AIResponse = response.data;

    // Validate response structure
    if (typeof data.matchScore !== "number" || typeof data.Insights !== "string") {
      throw new Error("Invalid response structure from AI server");
    }

    const matchScore = data.matchScore;
    const insights = data.Insights;

    return {
      matchScore,
      insights,
    };
  } catch (error: any) {
    console.error("Error communicating with Flask server:", error.message);
    throw new Error("Failed to calculate match score and insights");
  }
}

// Function to update both match score and insights in the database
export async function updateApplicantMatchScoreAndInsights(
  applicantId: number,
  matchScore: number,
  insights: string
) {
  try {
    console.log(
      `Updating match score and insights for applicant ${applicantId} to ${matchScore} and "${insights}"`
    );
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { matchScore, insights },
    });
  } catch (error: any) {
    console.error("Error updating match score and insights:", error.message);
    throw new Error("Failed to update match score and insights");
  }
}
