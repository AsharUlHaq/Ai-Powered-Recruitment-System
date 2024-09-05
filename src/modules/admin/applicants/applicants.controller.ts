import { Request, Response } from "express";
import {
  getApplicantsByStatus,
  getApplicantById,
  updateApplicantStatus,
  findApplicantsByPosition,
  aiBasedApplicantSearch,
  checkPositionExists,
  getApplicantsByPositionWithSortingMatchScore,
} from "./applicants.service";
import { ApplicationStatus } from "@prisma/client";
import {
  findApplicantsByPositionSchema,
  aiBasedSearchSchema,
  updateApplicantStatusSchema,
} from "./applicants.schema";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import prisma from "../../../utils/db.util";

export async function getApplicantsHandler(req: Request, res: Response) {
  const status = req.query.status as ApplicationStatus;

  try {
    // Validate the status parameter
    if (!status || !["DRAFT", "HIRED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        status: 400,
        message:
          "Invalid status value provided. Valid values are 'DRAFT', 'HIRED', 'REJECTED'.",
        data: null,
        success: false,
      });
    }

    // Fetch applicants by status
    const applicants = await getApplicantsByStatus(status);
    return res.status(200).json({
      status: 200,
      message: "Applicants retrieved successfully.",
      data: applicants,
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed.",
        data: null,
        success: false,
      });
    }

    // Handle general errors
    return res.status(400).json({
      status: 400,
      message: "An unexpected error occurred while retrieving applicants.",
      data: null,
      success: false,
    });
  }
}

// Handler to get applicant by ID
export async function getApplicantByIdHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);

  try {
    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid applicant ID provided.",
        data: null,
        success: false,
      });
    }

    // Fetch applicant by ID
    const applicant = await getApplicantById(id);

    // Check if applicant is not found
    if (!applicant) {
      return res.status(404).json({
        status: 404,
        message: `Applicant with ID ${id} does not exist in the database.`,
        data: null,
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Applicant retrieved successfully.",
      data: applicant,
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);

    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 400,
        message: error.message || "Validation failed.",
        data: null,
        success: false,
      });
    }

    // Handle Prisma errors specifically
    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(400).json({
        status: 400,
        message: "An error occurred while interacting with the database.",
        data: null,
        success: false,
      });
    }

    // Handle general errors
    return res.status(400).json({
      status: 400,
      message: "An unexpected error occurred.",
      data: null,
      success: false,
    });
  }
}

// / Handler to update applicant status
export async function updateApplicantStatusHandler(
  req: Request,
  res: Response
) {
  const id = parseInt(req.params.id);
  const { status } = req.query;

  try {
    // Validate request body
    updateApplicantStatusSchema.parse({ status });

    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid applicant ID provided.",
        data: null,
        success: false,
      });
    }

    // Ensure the status is a valid ApplicationStatus
    if (
      !Object.values(ApplicationStatus).includes(status as ApplicationStatus)
    ) {
      return res.status(400).json({
        status: 400,
        message: "Invalid status value provided.",
        data: null,
        success: false,
      });
    }

    // Attempt to update applicant status
    await updateApplicantStatus(id, status as ApplicationStatus);

    return res.status(200).json({
      status: 200,
      message: "Applicant status updated successfully.",
      data: null,
      success: true,
    });
  } catch (error: any) {
    console.error(error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 400,
        message: "Invalid status value provided.",
        data: null,
        success: false,
      });
    }

    // Handle Prisma-specific errors
    if (error.message.includes("Failed to update applicant status")) {
      return res.status(400).json({
        status: 400,
        message: "An error occurred while updating the applicant status.",
        data: null,
        success: false,
      });
    }

    // Handle any other unexpected errors
    return res.status(400).json({
      status: 400,
      message: "An unexpected error occurred.",
      data: null,
      success: false,
    });
  }
}

export async function findApplicantsByPositionHandler(
  req: Request,
  res: Response
) {
  try {
    // Extract positionId from URL parameters
    const { positionId } = req.params;

    // Validate positionId as a number
    const validatedPositionId = findApplicantsByPositionSchema.parse({
      positionId: parseInt(positionId, 10),
    }).positionId;

    // Check if the position exists
    const positionExists = await checkPositionExists(validatedPositionId);
    if (!positionExists) {
      return res.status(404).json({
        status: 404,
        message: "Position not found",
        data: null,
        success: false,
      });
    }

    // Fetch applicants by position ID
    const applicants = await findApplicantsByPosition(validatedPositionId);

    // Check if no applicants are found
    if (applicants.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No applicants found for the given position ID",
        data: null,
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Applicants found for the position",
      data: applicants,
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);
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
    return res.status(400).json({
      status: 400,
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
    return res.status(400).json({
      status: 400,
      message: "An error occurred while performing the AI-based search",
      data: null,
      success: false,
    });
  }
}

export async function getApplicantsByPositionHandler(
  req: Request,
  res: Response
) {
  const positionId = parseInt(req.params.positionId, 10); // Extract positionId from URL parameter

  if (isNaN(positionId)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid position ID",
      data: null,
      success: false,
    });
  }

  try {
    const applicants = await getApplicantsByPositionWithSortingMatchScore(
      positionId
    );
    return res.status(200).json({
      status: 200,
      message: "Applicants retrieved successfully",
      data: applicants,
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({
      status: 400,
      message: "Failed to retrieve applicants",
      data: null,
      success: false,
    });
  }
}
