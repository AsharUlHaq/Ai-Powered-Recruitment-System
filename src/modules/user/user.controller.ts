import { Request, Response } from "express";
import { findUserById, getUserById } from "./user.service";

export async function getLoggedInUserHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).userId; // Assuming userId is attached by the protect middleware

    if (!userId) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized. No user ID found.",
        data: null,
        success: false,
      });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found.",
        data: null,
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "User data retrieved successfully.",
      data: {
        username: user.username,
        email: user.email,
      },
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while retrieving user data.",
      data: null,
      success: false,
    });
  }
}
