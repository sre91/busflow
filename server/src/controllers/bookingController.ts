import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import Seat from "../models/Seat.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthRequest;

    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authenticated user is required",
      });
      return;
    }

    const { busId, journeyDate, passenger, seats, paymentMethod } = req.body;

    // Validate bus ID
    if (!busId || !mongoose.Types.ObjectId.isValid(busId)) {
      res.status(400).json({
        success: false,
        message: "Valid bus ID is required",
      });
      return;
    }

    // Validate journey date
    if (!journeyDate || isNaN(new Date(journeyDate).getTime())) {
      res.status(400).json({
        success: false,
        message: "Valid journey date is required",
      });
      return;
    }

    // Validate passenger details
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

    // Validate seats
    if (!Array.isArray(seats) || seats.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one seat is required",
      });
      return;
    }

    // Prevent duplicate seats
    const uniqueSeats = [...new Set(seats)];

    if (uniqueSeats.length !== seats.length) {
      res.status(400).json({
        success: false,
        message: "Duplicate seats are not allowed",
      });
      return;
    }

    // Validate payment method
    if (!["card", "upi"].includes(paymentMethod)) {
      res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
      return;
    }

    // Find bus
    const bus = await Bus.findById(busId);

    if (!bus) {
      res.status(404).json({
        success: false,
        message: "Bus not found",
      });
      return;
    }

    // Find selected seats
    const seatDocuments = await Seat.find({
      busId,
      seatNumber: { $in: uniqueSeats },
    });

    // Make sure all seats exist
    if (seatDocuments.length !== uniqueSeats.length) {
      res.status(400).json({
        success: false,
        message: "One or more selected seats do not exist",
      });
      return;
    }

    // Check whether seats are already booked
    // for this bus and journey date
    const existingBookings = await Booking.find({
      busId,
      journeyDate: new Date(journeyDate),
      bookingStatus: "confirmed",
      seats: { $in: uniqueSeats },
    });

    if (existingBookings.length > 0) {
      const bookedSeats = existingBookings.flatMap((booking) =>
        booking.seats.filter((seat) => uniqueSeats.includes(seat)),
      );

      res.status(409).json({
        success: false,
        message: "One or more selected seats are already booked",
        seats: [...new Set(bookedSeats)],
      });
      return;
    }

    // Calculate amount on the backend
    const totalAmount = bus.price * uniqueSeats.length;

    // Create booking
    const booking = await Booking.create({
      userId,
      busId,
      journeyDate: new Date(journeyDate),
      passenger,
      seats: uniqueSeats,
      totalAmount,
      paymentMethod,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
    });

    // Update available seats on the bus
    bus.availableSeats = Math.max(0, bus.availableSeats - uniqueSeats.length);

    await bus.save();

    // Populate bus information
    const populatedBooking = await Booking.findById(booking._id).populate(
      "busId",
      "operator source destination busType departureTime arrivalTime",
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthRequest;

    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authenticated user is required",
      });
      return;
    }

    const bookings = await Booking.find({
      userId,
    })
      .populate(
        "busId",
        "operator source destination busType departureTime arrivalTime",
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthRequest;

    const userId = authReq.user?.userId;

    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authenticated user is required",
      });
      return;
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Valid booking ID is required",
      });
      return;
    }

    const booking = await Booking.findOne({
      _id: id,
      userId,
    }).populate(
      "busId",
      "operator source destination busType departureTime arrivalTime",
    );

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthRequest;

    const userId = authReq.user?.userId;

    const id = req.params.id as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authenticated user is required",
      });
      return;
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Valid booking ID is required",
      });
      return;
    }

    const booking = await Booking.findOne({
      _id: id,
      userId,
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    if (booking.bookingStatus === "cancelled") {
      res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
      return;
    }

    // Mark booking as cancelled
    booking.bookingStatus = "cancelled";

    await booking.save();

    // Return the bus seat count
    const bus = await Bus.findById(booking.busId);

    if (bus) {
      bus.availableSeats += booking.seats.length;

      if (bus.availableSeats > bus.totalSeats) {
        bus.availableSeats = bus.totalSeats;
      }

      await bus.save();
    }

    const updatedBooking = await Booking.findById(booking._id).populate(
      "busId",
      "operator source destination busType departureTime arrivalTime",
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};
