import { Router } from "express";
import {
  getApplicantStatusSummaryHandler,
  getApplicantSummaryHandler,
  getDashboardStatsHandler,
} from "./dashboard.controller";
import { protect } from "../../../middleware/protect.middleware";

const adminDashboardRoutes = Router();

// Unified route for getting both active positions and draft applicants count
adminDashboardRoutes.get("/dashboard/stats", getDashboardStatsHandler);
adminDashboardRoutes.get("/applicants-by-field", getApplicantSummaryHandler);
adminDashboardRoutes.get(
  "/dashboard/hire-reject-summary",
  getApplicantStatusSummaryHandler
);

export { adminDashboardRoutes };
