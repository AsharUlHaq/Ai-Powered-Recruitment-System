// import { Request, Response } from "express";
// import { applicantSchema } from "./applicant.schema";
// import * as fs from "fs";
// import * as path from "path";
// import { createApplicant, findPositionIdByTitle } from "./applicant.service";
// import { log } from "console";

// function base64ToPdf(
//   base64String: string,
//   directory: string,
//   fileName: string
// ) {
//   // Remove the data URL prefix if it's included in the base64 string
//   const base64Data = base64String.replace(/^data:application\/pdf;base64,/, "");
//   // Convert the base64 string to a buffer
//   const pdfBuffer = Buffer.from(base64Data, "base64");
//   // Ensure the directory exists
//   if (!fs.existsSync(directory)) {
//     fs.mkdirSync(directory, { recursive: true });
//   }
//   // Construct the full file path
//   const filePath = path.join(directory, `${fileName}.pdf`);
//   // Write the buffer to a PDF file
//   fs.writeFileSync(filePath, pdfBuffer);
//   console.log(`PDF saved to ${filePath}`);
// }

// export async function submitApplicant(req: Request, res: Response) {
//   try {
//     console.log(req.body)
//     // Validate request body
//     const validationResult = applicantSchema.parse(req.body);
//     console.log(validationResult);
//     const positionTitle = validationResult.position;
//     if (!positionTitle) {
//       return res.status(400).json({ message: "Position is required." });
//     }
//     const position = await findPositionIdByTitle(positionTitle);
//     if (!position) {
//       return res.status(404).json({ message: "Position not found." });
//     }

//     const positionId = position.id;
//     // Ensure the position folder exists
//     const positionFolder = path.join(
//       __dirname,
//       "../../../uploads/",
//       positionTitle
//     );

//     if (!fs.existsSync(positionFolder)) {
//       fs.mkdirSync(positionFolder, { recursive: true });
//     }

//     // Prepare data for the applicant creation
//     const applicantData = {
//       ...validationResult,
//       positionId,
//       resumeUrl: positionFolder,
//     };

//     // Create applicant
//     const applicant = await createApplicant(applicantData);
//     base64ToPdf(
//       validationResult.resume,
//       positionFolder,
//       applicant.fullName + applicant.id
//     );
//     // Construct response
//     const response = {
//       status: 200,
//       message: "Applicant created successfully",
//       data: {
//         id: applicant.id,
//         fullName: applicant.fullName,
//         email: applicant.email,
//         phoneNumber: applicant.phoneNumber,
//         country: applicant.country,
//         city: applicant.city,
//         positionId: applicant.appliedFor.id,
//         positionTitle: applicant.appliedFor.title,
//         jobDescription: position.description,
//         resumeUrl: applicant.resumeUrl,
//         resumeBase64: validationResult.resume,
//         status: applicant.status,
//         createdAt: applicant.createdAt,
//         updatedAt: applicant.updatedAt,
//       },
//       success: true,
//     };

//     return res.status(201).json(response);
//   } catch (error: any) {
//     console.error(error);
//     if (error.name === "ZodError") {
//       return res.status(400).json({
//         message: "Validation failed",
//         details: error.errors.map((err: any) => ({
//           path: err.path,
//           message: err.message,
//         })),
//       });
//     }
//     return res.status(400).json({
//       status: 400,
//       message: "An error occurred while submitting the application.",
//       data: null,
//       success: false,
//     });
//   }
// }

// import { Request, Response } from 'express';
// import { applicantSchema } from './applicant.schema';
// import * as fs from 'fs';
// import * as path from 'path';
// import { createApplicant, findPositionIdByTitle } from './applicant.service';
// import { calculateMatchScore } from '../admin/Ai-Search/aiSearch.service'; // Import the function
// import prisma from '../../utils/db.util';

// function base64ToPdf(
//   base64String: string,
//   directory: string,
//   fileName: string
// ) {
//   // Remove the data URL prefix if it's included in the base64 string
//   const base64Data = base64String.replace(/^data:application\/pdf;base64,/, '');
//   // Convert the base64 string to a buffer
//   const pdfBuffer = Buffer.from(base64Data, 'base64');
//   // Ensure the directory exists
//   if (!fs.existsSync(directory)) {
//     fs.mkdirSync(directory, { recursive: true });
//   }
//   // Construct the full file path
//   const filePath = path.join(directory, `${fileName}.pdf`);
//   // Write the buffer to a PDF file
//   fs.writeFileSync(filePath, pdfBuffer);
//   console.log(`PDF saved to ${filePath}`);
// }

// export async function submitApplicant(req: Request, res: Response) {
//   try {
//     console.log(req.body)
//     // Validate request body
//     const validationResult = applicantSchema.parse(req.body);
//     console.log(validationResult);
//     const positionTitle = validationResult.position;
//     if (!positionTitle) {
//       return res.status(400).json({ message: 'Position is required.' });
//     }
//     const position = await findPositionIdByTitle(positionTitle);
//     if (!position) {
//       return res.status(404).json({ message: 'Position not found.' });
//     }

//     const positionId = position.id;
//     // Ensure the position folder exists
//     const positionFolder = path.join(
//       __dirname,
//       '../../../uploads/',
//       positionTitle
//     );

//     if (!fs.existsSync(positionFolder)) {
//       fs.mkdirSync(positionFolder, { recursive: true });
//     }

//     // Prepare data for the applicant creation
//     const applicantData = {
//       ...validationResult,
//       positionId,
//       resumeUrl: positionFolder,
//     };

//     // Create applicant
//     const applicant = await createApplicant(applicantData);
//     base64ToPdf(
//       validationResult.resume,
//       positionFolder,
//       applicant.fullName + applicant.id
//     );

//     // Perform AI evaluation
//     const matchScore = await calculateMatchScore(
//       position.description,
//       validationResult.resume
//     );

//     // Update the applicant's match score in the database
//     await prisma.applicant.update({
//       where: { id: applicant.id },
//       data: { matchScore },
//     });

//     // Construct response
//     const response = {
//       status: 200,
//       message: 'Applicant created and evaluated successfully',
//       data: {
//         id: applicant.id,
//         fullName: applicant.fullName,
//         email: applicant.email,
//         phoneNumber: applicant.phoneNumber,
//         country: applicant.country,
//         city: applicant.city,
//         positionId: applicant.appliedFor.id,
//         positionTitle: applicant.appliedFor.title,
//         jobDescription: position.description,
//         resumeUrl: applicant.resumeUrl,
//         resumeBase64: validationResult.resume,
//         status: applicant.status,
//         createdAt: applicant.createdAt,
//         updatedAt: applicant.updatedAt,
//         matchScore: applicant.matchScore,
//       },
//       success: true,
//     };

//     return res.status(201).json(response);
//   } catch (error: any) {
//     console.error(error);
//     if (error.name === 'ZodError') {
//       return res.status(400).json({
//         message: 'Validation failed',
//         details: error.errors.map((err: any) => ({
//           path: err.path,
//           message: err.message,
//         })),
//       });
//     }
//     return res.status(400).json({
//       status: 400,
//       message: 'An error occurred while submitting the application.',
//       data: null,
//       success: false,
//     });
//   }
// }

//correct code

// import { Request, Response } from "express";
// import { applicantSchema } from "./applicant.schema";
// import * as fs from "fs";
// import * as path from "path";
// import { createApplicant, findPositionIdByTitle } from "./applicant.service";
// import { calculateMatchScore } from "../admin/Ai-Search/aiSearch.service"; // Import the function
// import prisma from "../../utils/db.util";

// function base64ToPdf(
//   base64String: string,
//   directory: string,
//   fileName: string
// ) {
//   // Remove the data URL prefix if it's included in the base64 string
//   const base64Data = base64String.replace(/^data:application\/pdf;base64,/, "");
//   // Convert the base64 string to a buffer
//   const pdfBuffer = Buffer.from(base64Data, "base64");
//   // Ensure the directory exists
//   if (!fs.existsSync(directory)) {
//     fs.mkdirSync(directory, { recursive: true });
//   }
//   // Construct the full file path
//   const filePath = path.join(directory, fileName);
//   // Write the buffer to a PDF file
//   fs.writeFileSync(filePath, pdfBuffer);
//   console.log(`PDF saved to ${filePath}`);
// }

// export async function submitApplicant(req: Request, res: Response) {
//   try {
//     console.log(req.body);
//     // Validate request body
//     const validationResult = applicantSchema.parse(req.body);
//     console.log(validationResult);
//     const positionTitle = validationResult.position;
//     if (!positionTitle) {
//       return res.status(400).json({ message: "Position is required." });
//     }
//     const position = await findPositionIdByTitle(positionTitle);
//     if (!position) {
//       return res.status(404).json({ message: "Position not found." });
//     }

//     const positionId = position.id;
//     // Define a unique filename for the resume
//     const resumeFileName = `${validationResult.fullName.replace(
//       /\s+/g,
//       "_"
//     )}_${Date.now()}.pdf`;
//     const positionFolder = path.join(
//       __dirname,
//       "../../../uploads/",
//       positionTitle
//     );

//     // Ensure the position folder exists
//     if (!fs.existsSync(positionFolder)) {
//       fs.mkdirSync(positionFolder, { recursive: true });
//     }

//     // Prepare data for the applicant creation
//     const resumeUrl = path.join(positionTitle, resumeFileName); // Updated resumeUrl to include filename
//     const applicantData = {
//       ...validationResult,
//       positionId,
//       resumeUrl,
//     };

//     // Create applicant
//     const applicant = await createApplicant(applicantData);
//     base64ToPdf(
//       validationResult.resume,
//       path.join(__dirname, "../../../uploads/", positionTitle), // Path for saving the resume
//       resumeFileName
//     );

//     // Perform AI evaluation
//     const matchScore = await calculateMatchScore(
//       position.description,
//       validationResult.resume
//     );
//     console.log(`Calculated match score: ${matchScore}`);
//     // Update the applicant's match score in the database
//     await prisma.applicant.update({
//       where: { id: applicant.id },
//       data: { matchScore },
//     });

//     // Construct response
//     const response = {
//       status: 200,
//       message: "Applicant created and evaluated successfully",
//       data: {
//         id: applicant.id,
//         fullName: applicant.fullName,
//         email: applicant.email,
//         phoneNumber: applicant.phoneNumber,
//         country: applicant.country,
//         city: applicant.city,
//         positionId: applicant.appliedFor.id,
//         positionTitle: applicant.appliedFor.title,
//         jobDescription: position.description,
//         resumeUrl: resumeUrl, // Updated resumeUrl in response
//         resumeBase64: validationResult.resume,
//         status: applicant.status,
//         createdAt: applicant.createdAt,
//         updatedAt: applicant.updatedAt,
//         matchScore: matchScore,
//       },
//       success: true,
//     };

//     return res.status(201).json(response);
//   } catch (error: any) {
//     console.error(error);
//     if (error.name === "ZodError") {
//       return res.status(400).json({
//         message: "Validation failed",
//         details: error.errors.map((err: any) => ({
//           path: err.path,
//           message: err.message,
//         })),
//       });
//     }
//     return res.status(400).json({
//       status: 400,
//       message: "An error occurred while submitting the application.",
//       data: null,
//       success: false,
//     });
//   }
// }

import { Request, Response } from "express";
import { applicantSchema } from "./applicant.schema";
import * as fs from "fs";
import * as path from "path";
import { createApplicant, findPositionIdByTitle } from "./applicant.service";
import { calculateMatchScore } from "../admin/Ai-Search/aiSearch.service";
import prisma from "../../utils/db.util";

function base64ToPdf(
  base64String: string,
  directory: string,
  fileName: string
) {
  // Remove the data URL prefix if it's included in the base64 string
  const base64Data = base64String.replace(/^data:application\/pdf;base64,/, "");
  // Convert the base64 string to a buffer
  const pdfBuffer = Buffer.from(base64Data, "base64");
  // Ensure the directory exists
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  // Construct the full file path
  const filePath = path.join(directory, fileName);
  // Write the buffer to a PDF file
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`PDF saved to ${filePath}`);
}

export async function submitApplicant(req: Request, res: Response) {
  try {
    console.log(req.body);
    // Validate request body
    const validationResult = applicantSchema.parse(req.body);
    console.log(validationResult);
    const positionTitle = validationResult.position;
    if (!positionTitle) {
      return res.status(400).json({ message: "Position is required." });
    }
    const position = await findPositionIdByTitle(positionTitle);
    if (!position) {
      return res.status(404).json({ message: "Position not found." });
    }

    const positionId = position.id;
    // Define a unique filename for the resume
    const resumeFileName = `${validationResult.fullName.replace(
      /\s+/g,
      "_"
    )}_${Date.now()}.pdf`;
    const positionFolder = path.join(
      __dirname,
      "../../../uploads/",
      positionTitle
    );

    // Ensure the position folder exists
    if (!fs.existsSync(positionFolder)) {
      fs.mkdirSync(positionFolder, { recursive: true });
    }

    // Prepare data for the applicant creation
    const resumeUrl = path.join(positionTitle, resumeFileName); // Updated resumeUrl to include filename
    const applicantData = {
      ...validationResult,
      positionId,
      resumeUrl,
    };

    // Create applicant
    const applicant = await createApplicant(applicantData);
    base64ToPdf(
      validationResult.resume,
      path.join(__dirname, "../../../uploads/", positionTitle), // Path for saving the resume
      resumeFileName
    );

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
        resumeUrl: resumeUrl, // Updated resumeUrl in response
        resumeBase64: validationResult.resume,
        status: applicant.status,
        createdAt: applicant.createdAt,
        updatedAt: applicant.updatedAt,
      },
      success: true,
    };

    res.status(201).json(response);

    // Perform AI evaluation asynchronously
    try {
      const matchScore = await calculateMatchScore(
        position.description,
        validationResult.resume
      );
      console.log(`Calculated match score: ${matchScore}`);
      // Update the applicant's match score in the database
      await prisma.applicant.update({
        where: { id: applicant.id },
        data: { matchScore },
      });
    } catch (error: any) {
      console.error("Error calculating match score:", error.message);
      // Optionally log the error or handle it
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
