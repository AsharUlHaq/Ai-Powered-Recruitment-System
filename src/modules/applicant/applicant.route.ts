import { Router } from "express";
import { submitApplicant } from "./applicant.controller";

const applicantRoutes = Router();

applicantRoutes.post("/applicant/apply", submitApplicant);

export { applicantRoutes };
