import { z } from "zod";

export const applicantSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  position: z.string().min(1, "Position is required"),
  resumeUrl: z.string().optional(),
});
