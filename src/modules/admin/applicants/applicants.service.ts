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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Failed to perform AI-based search");
  }
}

export async function checkPositionExists(
  positionId: number
): Promise<boolean> {
  try {
    const position = await prisma.position.findUnique({
      where: { id: positionId },
    });
    return position !== null;
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Failed to check position existence");
  }
}

export async function updateApplicantMatchScore(
  applicantId: number,
  matchScore: number
) {
  try {
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { matchScore },
    });
  } catch (error: any) {
    console.error("Error updating match score:", error);
    throw new Error("Failed to update match score");
  }
}

export async function getApplicantsByPositionWithSortingMatchScore(
  positionId: number
) {
  // Fetch all applicants for the given position and sort by matchScore in descending order
  const applicants = await prisma.applicant.findMany({
    where: {
      positionId: positionId,
    },
    orderBy: {
      matchScore: "desc", // Sort applicants by matchScore in descending order
    },
  });

  return applicants;
}

// ---------------------

// export async function updateApplicantStatus(
//   id: number,
//   status: ApplicationStatus,
//   positionId: number
// ) {
//   try {
//     // Check if the position is filled before updating the applicant status
//     const isFilled = await isPositionFilled(positionId);
//     if (isFilled) {
//       throw new Error("Position is already filled");
//     }

//     await prisma.applicant.update({
//       where: { id },
//       data: { status },
//     });

//     // Check if the position is now filled and deactivate it if necessary
//     const filledPositions = await prisma.applicant.count({
//       where: { positionId, status: "HIRED" },
//     });

//     const position = await prisma.position.findUnique({
//       where: { id: positionId },
//     });

//     if (!position) {
//       throw new Error("Position not found");
//     }

//     if (filledPositions >= position.numberOfOpenings) {
//       await prisma.position.update({
//         where: { id: positionId },
//         data: { isActive: false },
//       });
//     }
//   } catch (error: any) {
//     if (error instanceof PrismaClientKnownRequestError) {
//       // Handle specific Prisma error
//       console.error("Prisma error:", error.message);
//     }
//     console.error("Failed to update applicant status:", error);
//     throw new Error("Failed to update applicant status");
//   }
// }

// export async function isPositionFilled(positionId: number) {
//   const filledPositions = await prisma.applicant.count({
//     where: { positionId, status: "HIRED" },
//   });

//   const position = await prisma.position.findUnique({
//     where: { id: positionId },
//   });

//   if (!position) {
//     throw new Error("Position not found");
//   }

//   return filledPositions >= position.numberOfOpenings;
// }