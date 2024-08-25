import { PrismaClient, ApplicationStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import axios from "axios";

const prisma = new PrismaClient();


export async function getApplicantsByStatus(status: ApplicationStatus) {
  try {
    const applicants = await prisma.applicant.findMany({
      where: { status },
      include: { appliedFor: true },
    });
    return applicants;
  } catch (error: any) {
    console.error("Error fetching applicants by status:", error.message);
    
    throw new Error("Failed to retrieve applicants. Please try again later.");
  }
}

export async function getApplicantById(id: number) {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id },
      include: { appliedFor: true },
    });

    // Return null if no applicant is found
    return applicant;
  } catch (error:any) {
    console.error("Failed to retrieve applicant:", error.message);

    // Handle Prisma-specific errors
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error("Prisma error occurred.");
    }

    // Rethrow general errors
    throw new Error("Failed to retrieve applicant.");
  }
}


export async function updateApplicantStatus(
  id: number,
  status: ApplicationStatus
) {
  try {
    await prisma.applicant.update({
      where: { id },
      data: { status },
    });
  } catch (error:any) {
    if (error instanceof PrismaClientKnownRequestError) {
      // Handle specific Prisma error
      console.error("Prisma error:", error.message);
    }
    console.error("Failed to update applicant status:", error);
    throw new Error("Failed to update applicant status");
  }
}

export async function findApplicantsByPosition(positionId: number) {
  try {
    const applicants = await prisma.applicant.findMany({
      where: { positionId },
      include: { appliedFor: true },
    });
    return applicants;
  } catch (error:any) {
    console.error(error.message);
    throw new Error("Failed to find applicants by position");
  }
}

export async function aiBasedApplicantSearch(
  positionId: number,
  numberOfCandidates: number
) {
  try {
    const response = await axios.post("http://flask-server-url/ai-search", {
      positionId,
      numberOfCandidates,
    });
    return response.data;
  } catch (error:any) {
    console.error(error.message);
    throw new Error("Failed to perform AI-based search");
  }
}

export async function checkPositionExists(positionId: number): Promise<boolean> {
  try {
    const position = await prisma.position.findUnique({
      where: { id: positionId }
    });
    return position !== null;
  } catch (error:any) {
    console.error(error.message);
    throw new Error("Failed to check position existence");
  }
}