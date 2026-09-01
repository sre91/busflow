import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import Seat from "../models/Seat.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();

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

    const parsedJourneyDate = new Date(journeyDate);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    parsedJourneyDate.setHours(0, 0, 0, 0);

    if (parsedJourneyDate < today) {
      res.status(400).json({
        success: false,
        message: "Journey date cannot be in the past",
      });
      return;
    }

    // Validate passenger details
    if (
      !passenger ||
      typeof passenger.name !== "string" ||
      passenger.name.trim().length < 2 ||
      typeof passenger.age !== "number" ||
      passenger.age < 1 ||
      passenger.age > 120 ||
      !["male", "female", "other"].includes(passenger.gender) ||
      typeof passenger.phone !== "string" ||
      !/^\d{10}$/.test(passenger.phone.trim()) ||
      typeof passenger.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email.trim())
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid passenger details",
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

    /*
     * Start transaction
     */

    session.startTransaction();

    // Find bus
    const bus = await Bus.findById(busId).session(session);

    if (!bus) {
      await session.abortTransaction();

      res.status(404).json({
        success: false,
        message: "Bus not found",
      });
      return;
    }

    // Find selected seats
    const seatDocuments = await Seat.find({
      busId,
      seatNumber: {
        $in: uniqueSeats,
      },
    }).session(session);

    // Make sure every seat exists
    if (seatDocuments.length !== uniqueSeats.length) {
      await session.abortTransaction();

      res.status(400).json({
        success: false,
        message: "One or more selected seats do not exist",
      });
      return;
    }

    // Check physical seat status
    const alreadyBookedSeats = seatDocuments.filter(
      (seat) => seat.status === "booked",
    );

    if (alreadyBookedSeats.length > 0) {
      await session.abortTransaction();

      res.status(409).json({
        success: false,
        message: "One or more selected seats are already booked",
        seats: alreadyBookedSeats.map((seat) => seat.seatNumber),
      });
      return;
    }

    // Check booking conflicts for this journey date
    const existingBookings = await Booking.find({
      busId,
      journeyDate: parsedJourneyDate,
      bookingStatus: "confirmed",
      seats: {
        $in: uniqueSeats,
      },
    }).session(session);

    if (existingBookings.length > 0) {
      const bookedSeats = existingBookings.flatMap((booking) =>
        booking.seats.filter((seat) => uniqueSeats.includes(seat)),
      );

      await session.abortTransaction();

      res.status(409).json({
        success: false,
        message: "One or more selected seats are already booked",
        seats: [...new Set(bookedSeats)],
      });
      return;
    }

    // Make sure bus has enough available seats
    if (bus.availableSeats < uniqueSeats.length) {
      await session.abortTransaction();

      res.status(409).json({
        success: false,
        message: "Not enough seats are available",
      });
      return;
    }

    // Calculate total on backend
    const convenienceFee = 49;

    const totalAmount = bus.price * uniqueSeats.length + convenienceFee;

    // Create booking inside transaction
    const createdBookings = await Booking.create(
      [
        {
          userId,
          busId,
          journeyDate: parsedJourneyDate,
          passenger,
          seats: uniqueSeats,
          totalAmount,
          paymentMethod,
          paymentStatus: "paid",
          bookingStatus: "confirmed",
        },
      ],
      {
        session,
      },
    );

    const booking = createdBookings[0];

    // Mark seats as booked
    await Seat.updateMany(
      {
        busId,
        seatNumber: {
          $in: uniqueSeats,
        },
        status: "available",
      },
      {
        $set: {
          status: "booked",
        },
      },
      {
        session,
      },
    );

    // Decrease bus available seats
    bus.availableSeats = Math.max(0, bus.availableSeats - uniqueSeats.length);

    await bus.save({
      session,
    });

    // Commit transaction
    await session.commitTransaction();

    // Populate after transaction completes
    const populatedBooking = await Booking.findById(booking._id).populate(
      "busId",
      "operator source destination busType departureTime arrivalTime",
    );

    sendSuccess(res, populatedBooking, "Booking created successfully", 201);
  } catch (error: any) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // MongoDB duplicate-key error
    if (error?.code === 11000) {
      res.status(409).json({
        success: false,
        message: "One or more selected seats are already booked",
      });
      return;
    }

    next(error);
  } finally {
    await session.endSession();
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

    sendSuccess(res, bookings, "Bookings fetched successfully");
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

    sendSuccess(res, booking, "Booking fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();

  try {
    const authReq = req as AuthRequest;

    const userId = authReq.user?.userId;

    const id = req.params.id as string;

    // Check authentication
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authenticated user is required",
      });
      return;
    }

    // Validate booking ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Valid booking ID is required",
      });
      return;
    }

    /*
     * Start transaction
     */

    session.startTransaction();

    // Find booking belonging to user
    const booking = await Booking.findOne({
      _id: id,
      userId,
    }).session(session);

    if (!booking) {
      await session.abortTransaction();

      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    // Prevent duplicate cancellation
    if (booking.bookingStatus === "cancelled") {
      await session.abortTransaction();

      res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
      return;
    }

    // Prevent cancellation after journey date
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const journeyDate = new Date(booking.journeyDate);

    journeyDate.setHours(0, 0, 0, 0);

    if (journeyDate < today) {
      await session.abortTransaction();

      res.status(400).json({
        success: false,
        message:
          "This booking can no longer be cancelled because the journey date has passed",
      });
      return;
    }

    // Mark booking as cancelled
    booking.bookingStatus = "cancelled";

    await booking.save({
      session,
    });

    // Restore bus seats
    const bus = await Bus.findById(booking.busId).session(session);

    if (bus) {
      bus.availableSeats += booking.seats.length;

      if (bus.availableSeats > bus.totalSeats) {
        bus.availableSeats = bus.totalSeats;
      }

      await bus.save({
        session,
      });
    }

    // Restore physical seat status
    await Seat.updateMany(
      {
        busId: booking.busId,
        seatNumber: {
          $in: booking.seats,
        },
      },
      {
        $set: {
          status: "available",
        },
      },
      {
        session,
      },
    );

    // Commit transaction
    await session.commitTransaction();

    // Fetch updated booking
    const updatedBooking = await Booking.findById(booking._id).populate(
      "busId",
      "operator source destination busType departureTime arrivalTime",
    );

    sendSuccess(res, updatedBooking, "Booking cancelled successfully");
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    next(error);
  } finally {
    await session.endSession();
  }
};
