import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function createApplicant(data: any) {
  try {
    const applicant = await prisma.applicant.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        country: data.country,
        city: data.city,
        appliedFor: {
          connect: { id: data.positionId },
        },
        resumeUrl: data.resumeUrl,
      },
      include: {
        appliedFor: true,
      },
    });
    return applicant;
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("An applicant with this email already exists.");
    }
    console.error(error);
    throw new Error("Failed to create applicant");
  }
}

export async function findPositionIdByTitle(title: string) {
  try {
    const position = await prisma.position.findUnique({
      where: { title },
    });
    if (!position) {
      throw new Error("Position not found");
    }
    return position;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to find position");
  }
}
