import { Request, Response } from "express";
import { applicantSchema } from "./applicant.schema";
import { createApplicant, findPositionIdByTitle } from "./applicant.service";
import {
  calculateMatchScore,
  updateApplicantMatchScoreAndInsights,
} from "../admin/Ai-Search/aiSearch.service";
import { storage } from "../../utils/firebase-admin.util";
import { sendApplicationNotification } from "../mailer/mailer.service";

async function uploadResumeToFirebase(
  base64String: string,
  fileName: string
): Promise<string> {
  const base64Data = base64String.replace(/^data:application\/pdf;base64,/, "");
  const fileBuffer = Buffer.from(base64Data, "base64");

  // Ensure you're calling file() on the bucket instance
  const file = storage.file(fileName);

  await file.save(fileBuffer, {
    contentType: "application/pdf",
    public: true, // Make it publicly accessible
    metadata: {
      firebaseStorageDownloadTokens: Date.now().toString(), // Unique token for the file
    },
  });

  // Get the public URL of the uploaded file
  return file.publicUrl();
}

export async function submitApplicant(req: Request, res: Response) {
  try {
    console.log(req.body);
    const validationResult = applicantSchema.parse(req.body);
    const positionTitle = validationResult.position;

    if (!positionTitle) {
      return res.status(400).json({ message: "Position is required." });
    }

    const position = await findPositionIdByTitle(positionTitle);

    if (!position) {
      return res.status(404).json({ message: "Position not found." });
    }

    const positionId = position.id;
    const resumeFileName = `${validationResult.fullName.replace(
      /\s+/g,
      "_"
    )}_${Date.now()}.pdf`;

    // Upload the resume to Firebase Storage
    const resumeUrl = await uploadResumeToFirebase(
      validationResult.resume,
      resumeFileName
    );

    const applicantData = {
      ...validationResult,
      positionId,
      resumeUrl,
    };

    const applicant = await createApplicant(applicantData);

    // Send response to frontend immediately
    const response = {
      status: 200,
      message: "Applicant created successfully. AI evaluation is in progress.",
      data: {
        id: applicant.id,
        fullName: applicant.fullName,
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
        country: applicant.country,
        city: applicant.city,
        positionId: applicant.appliedFor.id,
        positionTitle: applicant.appliedFor.title,
        jobDescription: position.description,
        resumeUrl: resumeUrl,
        status: applicant.status,
        createdAt: applicant.createdAt,
        updatedAt: applicant.updatedAt,
      },
      success: true,
    };

    res.status(201).json(response);

    // Send application notification email
    await sendApplicationNotification(
      applicant.email,
      applicant.fullName,
      positionTitle
    );

    // Perform AI evaluation asynchronously
    try {
      const { matchScore, insights } = await calculateMatchScore(
        position.description,
        validationResult.resume
      );
      console.log(`Calculated match score: ${matchScore}`);
      console.log(`Generated insights: ${insights}`);
      await updateApplicantMatchScoreAndInsights(
        applicant.id,
        matchScore,
        insights
      );
    } catch (error: any) {
      console.error(
        "Error calculating match score and insights:",
        error.message
      );
    }
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
    return res.status(400).json({
      status: 400,
      message: "An error occurred while submitting the application.",
      data: null,
      success: false,
    });
  }
}
