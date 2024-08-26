import { PrismaClient, ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardStats() {
  const [activePositionsCount, draftApplicantsCount] = await Promise.all([
    prisma.position.count({
      where: { isActive: true },
    }),
    prisma.applicant.count({
      where: { status: ApplicationStatus.DRAFT },
    }),
  ]);

  return {
    activePositionsCount,
    draftApplicantsCount,
  };
}
