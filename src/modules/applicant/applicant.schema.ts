import { z } from "zod";

export const applicantSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").max(50),
  phoneNumber: z
    .string()
    .min(13, "Phone number is required")
    .regex(
      /^\+\d{1,4}\s?\d{6,14}$/,
      "Phone number must start with a country code and be in a valid format"
    )
    .length(13),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  position: z.string().min(1, "Position is required"),
  resume: z.string(),
});
