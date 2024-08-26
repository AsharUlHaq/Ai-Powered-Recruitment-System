// import axios from 'axios';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const FLASK_SERVER_URL = 'https://a7ee-34-125-9-193.ngrok-free.app/comparison '; // Replace with your Flask server URL

// // Function to call Flask server and get match score
// export async function calculateMatchScore(jobDescription: string, resumeBase64: string): Promise<number> {
//   try {
//     const response = await axios.post(FLASK_SERVER_URL, {
//       JobDesc: jobDescription,
//       ResumeData: resumeBase64,
//     });

//     const { Extracted_Data } = response.data;

//     if (!Extracted_Data) {
//       throw new Error('No match score returned from AI server');
//     }

//     return parseFloat(Extracted_Data);
//   } catch (error: any) {
//     console.error('Error communicating with Flask server:', error);
//     throw new Error('Failed to calculate match score');
//   }
// }

// // Function to update the applicant's match score in the database
// export async function updateApplicantMatchScore(applicantId: number, matchScore: number) {
//   try {
//     await prisma.applicant.update({
//       where: { id: applicantId },
//       data: { matchScore },
//     });
//   } catch (error: any) {
//     console.error('Error updating match score:', error);
//     throw new Error('Failed to update match score');
//   }
// }

// aiSearch.service.ts
import axios from 'axios';
import prisma from '../../../utils/db.util';

const FLASK_SERVER_URL = 'https://992f-34-125-9-193.ngrok-free.app/comparison'; // Replace with your Flask server URL

export async function calculateMatchScore(jobDescription: string, resumeBase64: string): Promise<number> {
  try {
    const response = await axios.post(FLASK_SERVER_URL, {
      JobDesc: jobDescription,
      ResumeData: resumeBase64,
    });

    const { Extracted_Data } = response.data;

    if (!Extracted_Data) {
      throw new Error('No match score returned from AI server');
    }

    return parseFloat(Extracted_Data);
  } catch (error: any) {
    console.error('Error communicating with Flask server:', error);
    throw new Error('Failed to calculate match score');
  }
}

// Function to update the applicant's match score in the database
export async function updateApplicantMatchScore(applicantId: number, matchScore: number) {
  try {
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { matchScore },
    });
  } catch (error: any) {
    console.error('Error updating match score:', error);
    throw new Error('Failed to update match score');
  }
}
