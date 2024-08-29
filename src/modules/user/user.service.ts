import prisma from "../../utils/db.util";
import { Prisma } from "@prisma/client";

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email } });
  return user;
}

export async function findUserById(id: number) {
  try {
    const userId = await prisma.user.findUnique({ where: { id } });
    if (!userId) throw new Error(`User at id:${id} not exist`);
    return userId;
  } catch (error: any) {
    if (error.code === "P2025") {
      const recordNotFound = error.meta[1];
      return recordNotFound;
    }
  }
}

export async function getUserById(userId: number) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (error: any) {
    console.error("Error fetching user by ID:", error.message);
    throw new Error("Failed to retrieve user data");
  }
}
