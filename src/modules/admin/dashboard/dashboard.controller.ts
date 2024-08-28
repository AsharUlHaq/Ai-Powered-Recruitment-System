import { Request, Response } from "express";
import {
  getApplicantStatusSummary,
  getApplicantSummary,
  getDashboardStats,
} from "./dashboard.service";

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

export async function getApplicantSummaryHandler(req: Request, res: Response) {
  try {
    const summary = await getApplicantSummary();
    return res.status(200).json({
      status: 200,
      message: "Applicant summary retrieved successfully",
      data: summary,
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({
      status: 400,
      message: "Failed to retrieve applicant summary",
      data: null,
      success: false,
    });
  }
}
export async function getApplicantStatusSummaryHandler(
  req: Request,
  res: Response
) {
  try {
    const { totalOpenPositions, positionSummary } =
      await getApplicantStatusSummary();
    return res.status(200).json({
      status: 200,
      message: "Applicant status summary retrieved successfully",
      data: {
        totalOpenPositions,
        ...positionSummary,
      },
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({
      status: 400,
      message: "Failed to retrieve applicant status summary",
      data: null,
      success: false,
    });
  }
}
