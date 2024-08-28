import { Router } from "express";
import {
  getApplicantSummaryHandler,
  getDashboardStatsHandler,
} from "./dashboard.controller";

const adminDashboardRoutes = Router();

// Unified route for getting both active positions and draft applicants count
adminDashboardRoutes.get("/dashboard/stats", getDashboardStatsHandler);
adminDashboardRoutes.get("/applicants-by-field", getApplicantSummaryHandler);

export { adminDashboardRoutes };
