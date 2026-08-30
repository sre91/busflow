import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import Seat from "../models/Seat.js";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { busId, passenger, seats, totalAmount, paymentMethod } = req.body;

    if (!busId || !mongoose.Types.ObjectId.isValid(busId)) {
      res.status(400).json({
        success: false,
        message: "Valid bus ID is required",
      });
      return;
    }

    if (
      !passenger ||
      !passenger.name ||
      !passenger.age ||
      !passenger.gender ||
      !passenger.phone ||
      !passenger.email
    ) {
      res.status(400).json({
        success: false,
        message: "Complete passenger details are required",
      });
      return;
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one seat is required",
      });
      return;
    }

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      res.status(400).json({
        success: false,
        message: "Valid total amount is required",
      });
      return;
    }

    if (!["card", "upi"].includes(paymentMethod)) {
      res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
      return;
    }

    const bus = await Bus.findById(busId);

    if (!bus) {
      res.status(404).json({
        success: false,
        message: "Bus not found",
      });
      return;
    }

    const seatDocuments = await Seat.find({
      busId,
      seatNumber: { $in: seats },
    });

    if (seatDocuments.length !== seats.length) {
      res.status(400).json({
        success: false,
        message: "One or more selected seats do not exist",
      });
      return;
    }

    const alreadyBookedSeats = seatDocuments.filter(
      (seat) => seat.status === "booked",
    );

    if (alreadyBookedSeats.length > 0) {
      res.status(409).json({
        success: false,
        message: "One or more selected seats are already booked",
        seats: alreadyBookedSeats.map((seat) => seat.seatNumber),
      });
      return;
    }

    const booking = await Booking.create({
      busId,
      passenger,
      seats,
      totalAmount,
      paymentMethod,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
    });

    await Seat.updateMany(
      {
        busId,
        seatNumber: { $in: seats },
      },
      {
        $set: {
          status: "booked",
        },
      },
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
