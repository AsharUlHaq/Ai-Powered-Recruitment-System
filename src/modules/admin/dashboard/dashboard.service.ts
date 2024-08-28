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

export async function getApplicantSummary() {
  // Get the total number of applicants
  const totalApplicants = await prisma.applicant.count();

  // Get the count of applicants grouped by positionId
  const applicantsByPosition = await prisma.applicant.groupBy({
    by: ["positionId"],
    _count: {
      positionId: true,
    },
  });

  // Map the positionId to the title
  const positions = await Promise.all(
    applicantsByPosition.map(async (group) => {
      const position = await prisma.position.findUnique({
        where: { id: group.positionId },
        select: { title: true },
      });
      return {
        position: position?.title || "Unknown Position",
        count: group._count.positionId,
      };
    })
  );

  // Prepare the summary
  const summary = {
    totalApplicants,
    positions,
  };

  return summary;
}
