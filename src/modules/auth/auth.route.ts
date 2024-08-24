import { Router } from "express";
import { SignInUserHandler, signUpUserHandler } from "./auth.controller";
import { protect } from "../../middleware/protect.middleware";

const authRoutes = Router();

authRoutes.post("/sign-up", signUpUserHandler);
authRoutes.post("/sign-in", SignInUserHandler);

export { authRoutes };
