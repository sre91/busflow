import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Bus from "../models/Bus.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getBuses = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const buses = await Bus.find();

    sendSuccess(res, buses, "Buses fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const getBusById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid bus ID",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid bus ID",
      });
      return;
    }

    const bus = await Bus.findById(id);

    if (!bus) {
      res.status(404).json({
        success: false,
        message: "Bus not found",
      });
      return;
    }

    sendSuccess(res, bus, "Bus fetched successfully");
  } catch (error) {
    next(error);
  }
};
