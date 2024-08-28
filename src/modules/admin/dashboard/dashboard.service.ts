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

export async function getApplicantStatusSummary() {
  // Fetch total number of open positions
  const totalOpenPositions = await prisma.position.count({
    where: {
      isActive: true,
    },
  });

  // Group applicants by position and status
  const applicantGroups = await prisma.applicant.groupBy({
    by: ["positionId", "status"],
    _count: {
      status: true,
    },
  });

  // Fetch position titles
  const positionIds = [
    ...new Set(applicantGroups.map((group) => group.positionId)),
  ];
  const positions = await prisma.position.findMany({
    where: {
      id: { in: positionIds },
    },
    select: {
      id: true,
      title: true,
    },
  });

  // Map position titles
  const positionTitleMap = positions.reduce((map, position) => {
    map[position.id] = position.title;
    return map;
  }, {} as Record<number, string>);

  // Structure the data
  const positionSummary: Record<
    string,
    { totalApplicants: number; hired: number; rejected: number }
  > = {};

  applicantGroups.forEach((group) => {
    const positionTitle =
      positionTitleMap[group.positionId] || "Unknown Position";

    if (!positionSummary[positionTitle]) {
      positionSummary[positionTitle] = {
        totalApplicants: 0,
        hired: 0,
        rejected: 0,
      };
    }

    positionSummary[positionTitle].totalApplicants += group._count.status;
    if (group.status === ApplicationStatus.HIRED) {
      positionSummary[positionTitle].hired += group._count.status;
    } else if (group.status === ApplicationStatus.REJECTED) {
      positionSummary[positionTitle].rejected += group._count.status;
    }
  });

  return {
    totalOpenPositions,
    positionSummary,
  };
}
