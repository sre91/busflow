import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Seat from "../models/Seat.js";
import Booking from "../models/Booking.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getSeatsByBus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { busId } = req.params;
    const { journeyDate } = req.query;

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

    // Get all physical seats for the bus
    const seats = await Seat.find({
      busId,
    }).sort({
      seatNumber: 1,
    });

    // If no journey date is provided,
    // return the physical seats as they are.
    if (!journeyDate || typeof journeyDate !== "string") {
      sendSuccess(res, seats, "Seats fetched successfully");
      return;
    }

    // Validate journey date
    const parsedJourneyDate = new Date(journeyDate);

    if (isNaN(parsedJourneyDate.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid journey date",
      });
      return;
    }

    // Find confirmed bookings for this bus and journey date
    const bookings = await Booking.find({
      busId,
      journeyDate: parsedJourneyDate,
      bookingStatus: "confirmed",
    }).select("seats");

    // Collect booked seat numbers
    const bookedSeats = new Set(bookings.flatMap((booking) => booking.seats));

    // Add availability information for frontend
    const seatsWithAvailability = seats.map((seat) => ({
      ...seat.toObject(),

      status: bookedSeats.has(seat.seatNumber) ? "booked" : "available",
    }));

    sendSuccess(res, seatsWithAvailability, "Seats fetched successfully");
  } catch (error) {
    next(error);
  }
};
