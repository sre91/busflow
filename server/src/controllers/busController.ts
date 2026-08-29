import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Bus from "../models/Bus.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getBuses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { source, destination, busType } = req.query;

    const filter: Record<string, string> = {};

    if (typeof source === "string" && source.trim()) {
      filter.source = source.trim();
    }

    if (typeof destination === "string" && destination.trim()) {
      filter.destination = destination.trim();
    }

    if (typeof busType === "string" && busType.trim()) {
      filter.busType = busType.trim();
    }

    const buses = await Bus.find(filter);

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

export const createBus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bus = await Bus.create(req.body);

    sendSuccess(res, bus, "Bus created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const updateBus = async (
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

    const bus = await Bus.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bus) {
      res.status(404).json({
        success: false,
        message: "Bus not found",
      });
      return;
    }

    sendSuccess(res, bus, "Bus updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteBus = async (
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

    const bus = await Bus.findByIdAndDelete(id);

    if (!bus) {
      res.status(404).json({
        success: false,
        message: "Bus not found",
      });
      return;
    }

    sendSuccess(res, bus, "Bus deleted successfully");
  } catch (error) {
    next(error);
  }
};
