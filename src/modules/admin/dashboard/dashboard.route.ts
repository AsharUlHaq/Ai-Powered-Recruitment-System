import { Router } from "express";
import { getDashboardStatsHandler } from "./dashboard.controller";

const adminDashboardRoutes = Router();

// Unified route for getting both active positions and draft applicants count
adminDashboardRoutes.get("/dashboard/stats", getDashboardStatsHandler);

export {adminDashboardRoutes};
