import { Router } from "express";
import {
  getApplicantStatusSummaryHandler,
  getApplicantSummaryHandler,
  getDashboardStatsHandler,
} from "./dashboard.controller";
import { protect } from "../../../middleware/protect.middleware";

const adminDashboardRoutes = Router();

// Unified route for getting both active positions and draft applicants count
adminDashboardRoutes.get("/dashboard/stats", protect, getDashboardStatsHandler);
adminDashboardRoutes.get(
  "/applicants-by-field",
  protect,
  getApplicantSummaryHandler
);
adminDashboardRoutes.get(
  "/dashboard/hire-reject-summary",
  protect,
  getApplicantStatusSummaryHandler
);

export { adminDashboardRoutes };
