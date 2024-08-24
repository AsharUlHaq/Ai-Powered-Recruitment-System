import { Router } from "express";
import multer from "multer";
import { submitApplicant } from "./applicant.controller";

const applicantRoutes = Router();

// Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

applicantRoutes.post(
  "/applicant/apply",
  upload.single("resume"),
  submitApplicant
);

export { applicantRoutes };
