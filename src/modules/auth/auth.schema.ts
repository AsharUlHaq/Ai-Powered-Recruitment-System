import { z } from "zod";

export const userSignUpSchema = z.object({
  username: z.string().max(25).min(3),
  email: z
    .string()
    .email({ message: "Invalid, Enter valid email address" })
    .max(50),
  password: z.string().min(8).max(25),
});

export type SignUpType = z.infer<typeof userSignUpSchema>;

export const userSignInSchema = z.object({
  email: z.string().email({ message: "Invalid, Enter valid email address" }),
  password: z.string(),
});

export type SignInType = z.infer<typeof userSignInSchema>;
