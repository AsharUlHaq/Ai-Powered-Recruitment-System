import { Request, Response } from "express";
import {
  getApplicantsByStatus,
  getApplicantById,
  updateApplicantStatus,
  findApplicantsByPosition,
  aiBasedApplicantSearch,
} from "./applicants.service";
import { ApplicationStatus } from "@prisma/client";
import {
  findApplicantsByPositionSchema,
  aiBasedSearchSchema,
  updateApplicantStatusSchema,
} from "./applicants.schema";
import { ZodError } from "zod";

// Handler to get applicants by status
export async function getApplicantsHandler(req: Request, res: Response) {
  const status = req.query.status as ApplicationStatus;

  try {
    if (!status) {
      return res.status(400).json({
        status: 400,
        message: "Status query parameter is required",
        data: null,
        success: false,
      });
    }

    const applicants = await getApplicantsByStatus(status);
    return res.status(200).json({
      status: 200,
      message: "Applicants retrieved successfully",
      data: applicants,
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while retrieving applicants",
      data: null,
      success: false,
    });
  }
}

// Handler to get applicant by ID
export async function getApplicantByIdHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);

  try {
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid applicant ID",
        data: null,
        success: false,
      });
    }

    const applicant = await getApplicantById(id);
    if (!applicant) {
      return res.status(404).json({
        status: 404,
        message: "Applicant not found",
        data: null,
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Applicant retrieved successfully",
      data: applicant,
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while retrieving the applicant",
      data: null,
      success: false,
    });
  }
}

// Handler to update applicant status
export async function updateApplicantStatusHandler(
  req: Request,
  res: Response
) {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  try {
    // Validate request body
    updateApplicantStatusSchema.parse({ status });

    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid applicant ID",
        data: null,
        success: false,
      });
    }

    await updateApplicantStatus(id, status as ApplicationStatus);
    return res.status(200).json({
      status: 200,
      message: "Applicant status updated successfully",
      data: null,
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        details: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
        success: false,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "An error occurred while updating the applicant status",
      data: null,
      success: false,
    });
  }
}

// Handler to find applicants by position
export async function findApplicantsByPositionHandler(
  req: Request,
  res: Response
) {
  try {
    // Validate query parameters
    const { positionId } = findApplicantsByPositionSchema.parse(req.query);

    const applicants = await findApplicantsByPosition(positionId);
    return res.status(200).json({
      status: 200,
      message: "Applicants found for the position",
      data: applicants,
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        details: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
        success: false,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "An error occurred while finding applicants",
      data: null,
      success: false,
    });
  }
}

// Handler for AI-based search
export async function aiBasedSearchHandler(req: Request, res: Response) {
  try {
    // Validate request body
    const { positionId, numberOfCandidates } = aiBasedSearchSchema.parse(
      req.body
    );

    const result = await aiBasedApplicantSearch(positionId, numberOfCandidates);
    return res.status(200).json({
      status: 200,
      message: "AI-based search completed successfully",
      data: result,
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        details: error.errors.map((err) => ({
          path: err.path,
          message: err.message,
        })),
        success: false,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "An error occurred while performing the AI-based search",
      data: null,
      success: false,
    });
  }
}
