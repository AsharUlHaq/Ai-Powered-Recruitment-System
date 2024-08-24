import { Request, Response } from "express";
import { applicantSchema } from "./applicant.schema";
import * as fs from "fs";
import * as path from "path";
import { createApplicant, findPositionIdByTitle } from "./applicant.service";

export async function submitApplicant(req: Request, res: Response) {
  try {
    // Validate request body
    const validationResult = applicantSchema.parse(req.body);

    const positionTitle = validationResult.position; // Use position field to find the positionId
    if (!positionTitle) {
      return res.status(400).json({ message: "Position is required." });
    }

    // Find the positionId by position title
    const position = await findPositionIdByTitle(positionTitle);
    if (!position) {
      return res.status(404).json({ message: "Position not found." });
    }

    const positionId = position.id;

    // Ensure the position folder exists
    const positionFolder = path.join(
      __dirname,
      "../../../uploads/",
      positionTitle
    );

    if (!fs.existsSync(positionFolder)) {
      fs.mkdirSync(positionFolder, { recursive: true });
    }

    // Handle file upload
    const { file } = req;
    if (!file || file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ message: "Attachment must be a PDF file." });
    }

    const resumePath = path.join(positionFolder, file.originalname);
    fs.renameSync(file.path, resumePath);

    // Prepare data for the applicant creation
    const applicantData = {
      ...validationResult,
      positionId,
      resumeUrl: resumePath,
    };

    // Create applicant
    const applicant = await createApplicant(applicantData);

    // Construct response
    const response = {
      status: 200,
      message: "Applicant created successfully",
      data: {
        id: applicant.id,
        fullName: applicant.fullName,
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
        country: applicant.country,
        city: applicant.city,
        positionId: applicant.appliedFor.id,
        positionTitle: applicant.appliedFor.title,
        resumeUrl: applicant.resumeUrl,
        status: applicant.status,
        createdAt: applicant.createdAt,
        updatedAt: applicant.updatedAt,
      },
      success: true,
    };

    return res.status(201).json(response);
  } catch (error: any) {
    console.error(error);
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        details: error.errors.map((err: any) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      message: "An error occurred while submitting the application.",
    });
  }
}
