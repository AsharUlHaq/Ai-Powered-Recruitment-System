import { Router } from "express";
import {
  getAllPositionsHandler,
  createPositionHandler,
  updatePositionHandler,
  togglePositionStatusHandler,
} from "./position.controller";
import { protect } from "../../../middleware/protect.middleware";

const positionRoutes = Router();

positionRoutes.get("/getAllPositions", protect, getAllPositionsHandler);

positionRoutes.post("/create-position", protect, createPositionHandler);

positionRoutes.patch("/update-position/:id", protect, updatePositionHandler);

positionRoutes.patch(
  "/toggle-position-status/:id/status",
  protect,
  togglePositionStatusHandler
);

export { positionRoutes };
