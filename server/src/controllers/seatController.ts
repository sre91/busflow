import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Seat from "../models/Seat.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getSeatsByBus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { busId } = req.params;

    if (typeof busId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid bus ID",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(busId)) {
      res.status(400).json({
        success: false,
        message: "Invalid bus ID",
      });
      return;
    }

    const seats = await Seat.find({
      busId,
    }).sort({
      seatNumber: 1,
    });

    sendSuccess(res, seats, "Seats fetched successfully");
  } catch (error) {
    next(error);
  }
};
