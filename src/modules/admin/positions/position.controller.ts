import { Request, Response } from "express";
import { ZodError } from "zod";
import { positionSchema } from "./position.schema";
import {
  getAllPositions,
  togglePositionStatus,
  updatePosition,
  createPosition,
} from "./positions.service";

// Handler to get all positions
export async function getAllPositionsHandler(req: Request, res: Response) {
  try {
    const positions = await getAllPositions();
    return res.status(200).json({
      status: 200,
      message: "Positions retrieved successfully",
      data: positions,
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({
      status: 400,
      message: "Failed to retrieve positions",
      data: null,
      success: false,
    });
  }
}

// Handler to create positions
export async function createPositionHandler(req: Request, res: Response) {
  try {
    const validationResult = positionSchema.parse(req.body);
    const position = await createPosition(validationResult);
    return res.status(201).json({
      status: 201,
      message: "Position created successfully",
      data: position,
      success: true,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const messageJSON = JSON.parse(error.message);
      const message = `${messageJSON[0].path[0]} is ${messageJSON[0].message}`;
      console.error(message);
      return res.status(400).json({
        status: 400,
        message: message,
        data: null,
        success: false,
      });
    }

    // Handle custom errors from the service
    if (error.message.startsWith("Position with title")) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        data: null,
        success: false,
      });
    }

    console.error(error.message);
    return res.status(400).json({
      status: 400,
      message: "Failed to create position",
      data: null,
      success: false,
    });
  }
}

// Handler to update a position by ID
export async function updatePositionHandler(req: Request, res: Response) {
  try {
    const positionId = parseInt(req.params.id, 10);
    if (isNaN(positionId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid position ID",
        data: null,
        success: false,
      });
    }
    const validationResult = positionSchema.partial().parse(req.body);
    const position = await updatePosition(positionId, validationResult);
    return res.status(200).json({
      status: 200,
      message: "Position updated successfully",
      data: position,
      success: true,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const messageJSON = JSON.parse(error.message);
      const message = `${messageJSON[0].path[0]} is ${messageJSON[0].message}`;
      console.error(message);
      return res.status(400).json({
        status: 400,
        message: message,
        data: null,
        success: false,
      });
    }
    console.error(error.message);
    return res.status(400).json({
      status: 400,
      message: "Failed to update position",
      data: null,
      success: false,
    });
  }
}

// Handler to toggle position status by ID
export async function togglePositionStatusHandler(req: Request, res: Response) {
  try {
    const positionId = parseInt(req.params.id, 10);
    if (isNaN(positionId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid position ID",
        data: null,
        success: false,
      });
    }
    const position = await togglePositionStatus(positionId);
    return res.status(200).json({
      status: 200,
      message: "Position status updated successfully",
      data: position,
      success: true,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(400).json({
      status: 400,
      message: "Failed to update position status",
      data: null,
      success: false,
    });
  }
}
