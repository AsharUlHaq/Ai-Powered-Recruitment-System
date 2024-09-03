import axios from "axios";
import axiosRetry from "axios-retry";
import prisma from "../../../utils/db.util";
import { ENV } from "../../../utils/env.util";

const FLASK_SERVER: string = ENV.FLASK_SERVER_URL as string;

// Configure axios retry
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export async function calculateMatchScore(
  jobDescription: string,
  resumeBase64: string
): Promise<{ matchScore: number; insights: string }> {
  try {
    const response = await axios.post(
      `${FLASK_SERVER}`,
      {
        JobDesc: jobDescription,
        ResumeData: resumeBase64,
      },
      {
        timeout: 300000, // 5 minutes
      }
    );

    console.log("Flask server response:", response.data); // For debugging

    const data = response.data;

    if (
      typeof data.matchScore !== "number" ||
      typeof data.Insights !== "string"
    ) {
      console.error("Invalid response structure:", data);
      throw new Error("Invalid response structure from AI server");
    }

    return {
      matchScore: data.matchScore,
      insights: data.Insights,
    };
  } catch (error: any) {
    if (error.code === "ECONNRESET") {
      console.error("Connection was reset:", error.message);
    } else if (error.code === "ETIMEDOUT") {
      console.error("Request timed out:", error.message);
    } else {
      console.error("Error communicating with Flask server:", error.message);
    }
    throw new Error("Failed to calculate match score and insights");
  }
}

// // Function to update both match score and insights in the database
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
