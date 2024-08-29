import { Router } from "express";
import { getLoggedInUserHandler } from "./user.controller";
import { protect } from "../../middleware/protect.middleware";

const userRoutes = Router();

userRoutes.get("/me", protect, getLoggedInUserHandler);

export { userRoutes };
