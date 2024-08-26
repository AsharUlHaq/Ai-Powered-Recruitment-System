import { Request, Response } from "express";
import { getDashboardStats } from "./dashboard.service";

// Unified handler to get total count of active positions and draft applicants
export async function getDashboardStatsHandler(req: Request, res: Response) {
  try {
    const stats = await getDashboardStats();
    return res.status(200).json({
      status: 200,
      message: "Dashboard statistics retrieved successfully",
      data: stats,
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({
      status: 400,
      message: "Failed to retrieve dashboard statistics",
      data: null,
      success: false,
    });
  }
}
