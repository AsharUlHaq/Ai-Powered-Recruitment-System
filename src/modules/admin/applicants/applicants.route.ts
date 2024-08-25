import { Router } from "express";
import {
  getApplicantByIdHandler,
  getApplicantsHandler,
  updateApplicantStatusHandler,
  findApplicantsByPositionHandler,
  aiBasedSearchHandler,
} from "./applicants.controller";

const adminPortalApplicantRoutes = Router();

// Route to get applicants by status (draft, hired, rejected)
adminPortalApplicantRoutes.get(
  "/getApplicantByStatus/status",
  getApplicantsHandler
);

// Route to get a specific applicant by ID
adminPortalApplicantRoutes.get("/getOneApplicant/:id", getApplicantByIdHandler);

// Route to update applicant status (hire or reject)
adminPortalApplicantRoutes.patch("/applicantStatus/:id/status", updateApplicantStatusHandler);

// Route to find applicants by position ID
adminPortalApplicantRoutes.get(
  "/applicantsByPosition/:positionId",
  findApplicantsByPositionHandler
);

// Route for AI-based search
adminPortalApplicantRoutes.post(
  "/findApplicant/search/ai",
  aiBasedSearchHandler
);

export { adminPortalApplicantRoutes };
