import { Router } from "express";
import {
  getApplicantStatusSummaryHandler,
  getApplicantSummaryHandler,
  getDashboardStatsHandler,
} from "./dashboard.controller";
import { protect } from "../../../middleware/protect.middleware";

const adminDashboardRoutes = Router();

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
