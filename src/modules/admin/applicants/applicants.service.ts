import { PrismaClient, ApplicationStatus } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function getApplicantsByStatus(status: ApplicationStatus) {
  try {
    const applicants = await prisma.applicant.findMany({
      where: { status },
      include: { appliedFor: true },
    });
    return applicants;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve applicants");
  }
}

export async function getApplicantById(id: number) {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id },
      include: { appliedFor: true },
    });
    if (!applicant) {
      throw new Error("Applicant not found");
    }
    return applicant;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve applicant");
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
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
    throw new Error("Failed to perform AI-based search");
  }
}
