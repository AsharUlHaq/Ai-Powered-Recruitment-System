import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all positions
export async function getAllPositions() {
  return await prisma.position.findMany();
}

export async function createPosition(data: {
  title: string;
  experience?: string;
  numberOfOpenings: number;
  description: string;
}) {
  try {
    return await prisma.position.create({
      data: {
        title: data.title,
        experience: data.experience ?? "",
        numberOfOpenings: data.numberOfOpenings,
        description: data.description,
      },
    });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constraint violation
        throw new Error(`Position with title '${data.title}' already exists.`);
      }
    }
    throw error.message; // Re-throw if it's not a known Prisma error
  }
}

// Update an existing position by ID
export async function updatePosition(
  positionId: number,
  data: {
    title?: string;
    experience?: string;
    numberOfOpenings?: number;
    description?: string;
  }
) {
  return await prisma.position.update({
    where: { id: positionId },
    data: {
      title: data.title,
      experience: data.experience ?? "",
      numberOfOpenings: data.numberOfOpenings,
      description: data.description,
    },
  });
}

// Toggle the active/inactive status of a position by ID
export async function togglePositionStatus(positionId: number) {
  const position = await prisma.position.findUnique({
    where: { id: positionId },
  });

  if (!position) {
    throw new Error("Position not found");
  }

  const updatedStatus = !position.isActive;
  return await prisma.position.update({
    where: { id: positionId },
    data: { isActive: updatedStatus },
  });
}
