// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // Get all positions
// export async function getAllPositions() {
//   return await prisma.position.findMany();
// }

// // Create a new position
// export async function createPosition(data: {
//   title: string;
//   experience?: string; 
//   numberOfOpenings: number;
// }) {
//   return await prisma.position.create({
//     data: {
//       title: data.title,
//       experience: data.experience ?? "", // Default to an empty string if undefined
//       numberOfOpenings: data.numberOfOpenings,
//     },
//   });
// }

// // Update an existing position by ID
// export async function updatePosition(
//   positionId: number,
//   data: {
//     title?: string;
//     experience?: string; // Experience can be undefined
//     numberOfOpenings?: number;
//   }
// ) {
//   return await prisma.position.update({
//     where: { id: positionId },
//     data: {
//       title: data.title,
//       experience: data.experience ?? "", // Default to an empty string if undefined
//       numberOfOpenings: data.numberOfOpenings,
//     },
//   });
// }

// // Toggle the active/inactive status of a position by ID
// export async function togglePositionStatus(positionId: number) {
//   const position = await prisma.position.findUnique({
//     where: { id: positionId },
//   });

//   if (!position) {
//     throw new Error("Position not found");
//   }

//   const updatedStatus = !position.isActive;
//   return await prisma.position.update({
//     where: { id: positionId },
//     data: { isActive: updatedStatus },
//   });
// }

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all positions
export async function getAllPositions() {
  return await prisma.position.findMany();
}

// Create a new position
export async function createPosition(data: {
  title: string;
  experience?: string;
  numberOfOpenings: number;
  description: string; // New field for description
}) {
  return await prisma.position.create({
    data: {
      title: data.title,
      experience: data.experience ?? "", // Default to an empty string if undefined
      numberOfOpenings: data.numberOfOpenings,
      description: data.description, // Include job description
    },
  });
}

// Update an existing position by ID
export async function updatePosition(
  positionId: number,
  data: {
    title?: string;
    experience?: string;
    numberOfOpenings?: number;
    description?: string; // Optional description update
  }
) {
  return await prisma.position.update({
    where: { id: positionId },
    data: {
      title: data.title,
      experience: data.experience ?? "", // Default to an empty string if undefined
      numberOfOpenings: data.numberOfOpenings,
      description: data.description, // Update job description if provided
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
