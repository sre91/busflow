import { Response, NextFunction } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import Seat from "../models/Seat.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { getIO } from "../socket/socket.js";

// Create booking
export const createBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { busId, journeyDate, passenger, seats, paymentMethod } = req.body;

    if (!busId || !mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({
        success: false,
        message: "Valid bus ID is required",
      });
    }

    if (!journeyDate) {
      return res.status(400).json({
        success: false,
        message: "Journey date is required",
      });
    }

    const selectedJourneyDate = new Date(journeyDate);

    if (Number.isNaN(selectedJourneyDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid journey date",
      });
    }

    if (selectedJourneyDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Journey date cannot be in the past",
      });
    }

    if (
      !passenger ||
      !passenger.name ||
      !passenger.age ||
      !passenger.gender ||
      !passenger.phone ||
      !passenger.email
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete passenger details are required",
      });
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one seat must be selected",
      });
    }

    const uniqueSeats = [...new Set(seats)];

    if (uniqueSeats.length !== seats.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate seats are not allowed",
      });
    }

    if (!["card", "upi"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    session.startTransaction();

    const bus = await Bus.findById(busId).session(session);

    if (!bus) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const selectedSeats = await Seat.find({
      busId,
      seatNumber: {
        $in: uniqueSeats,
      },
    }).session(session);

    if (selectedSeats.length !== uniqueSeats.length) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "One or more selected seats are invalid",
      });
    }

    const alreadyBookedPhysicalSeats = selectedSeats
      .filter((seat) => seat.status === "booked")
      .map((seat) => seat.seatNumber);

    if (alreadyBookedPhysicalSeats.length > 0) {
      await session.abortTransaction();

      return res.status(409).json({
        success: false,
        message: "One or more selected seats are already booked",
        seats: alreadyBookedPhysicalSeats,
      });
    }

    const startOfDay = new Date(selectedJourneyDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedJourneyDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      busId,
      journeyDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      bookingStatus: "confirmed",
      seats: {
        $in: uniqueSeats,
      },
    }).session(session);

    if (existingBookings.length > 0) {
      const bookedSeats = [
        ...new Set(existingBookings.flatMap((booking) => booking.seats)),
      ];

      await session.abortTransaction();

      return res.status(409).json({
        success: false,
        message: "One or more selected seats are already booked",
        seats: bookedSeats,
      });
    }

    if (bus.availableSeats < uniqueSeats.length) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
      });
    }

    const convenienceFee = 49;

    const totalAmount = bus.price * uniqueSeats.length + convenienceFee;

    const [booking] = await Booking.create(
      [
        {
          userId: req.user.userId,
          busId,
          journeyDate: selectedJourneyDate,
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

    await Seat.updateMany(
      {
        busId,
        seatNumber: {
          $in: uniqueSeats,
        },
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

    bus.availableSeats -= uniqueSeats.length;

    await bus.save({
      session,
    });

    await session.commitTransaction();
    session.endSession();

    // Real-time seat update after successful booking
    const io = getIO();

    io.to(`bus:${busId}`).emit("seatUpdate", {
      event: "booking",
      busId,
      bookedSeats: uniqueSeats,
      releasedSeats: [],
      availableSeats: bus.availableSeats,
    });

    const populatedBooking = await Booking.findById(booking._id).populate(
      "busId",
      "operator source destination busType departureTime arrivalTime",
    );

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: populatedBooking,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();

    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message: "One or more selected seats are already booked",
      });
    }

    next(error);
  }
};

// Get current user's bookings
export const getMyBookings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bookings = await Booking.find({
      userId: req.user.userId,
    })
      .populate(
        "busId",
        "operator source destination busType departureTime arrivalTime",
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
export const getBookingById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      userId: req.user.userId,
    }).populate(
      "busId",
      "operator source destination busType departureTime arrivalTime",
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
export const cancelBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    session.startTransaction();

    const booking = await Booking.findOne({
      _id: id,
      userId: req.user.userId,
    }).session(session);

    if (!booking) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus === "cancelled") {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    const journeyDate = new Date(booking.journeyDate);

    if (journeyDate < new Date()) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Past bookings cannot be cancelled",
      });
    }

    const bus = await Bus.findById(booking.busId).session(session);

    if (!bus) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    booking.bookingStatus = "cancelled";

    await booking.save({
      session,
    });

    bus.availableSeats += booking.seats.length;

    if (bus.availableSeats > bus.totalSeats) {
      bus.availableSeats = bus.totalSeats;
    }

    await bus.save({
      session,
    });

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

    await session.commitTransaction();
    session.endSession();

    // Real-time seat update after successful cancellation
    const io = getIO();

    io.to(`bus:${booking.busId.toString()}`).emit("seatUpdate", {
      event: "cancellation",
      busId: booking.busId.toString(),
      bookedSeats: [],
      releasedSeats: booking.seats,
      availableSeats: bus.availableSeats,
    });

    const populatedBooking = await Booking.findById(booking._id).populate(
      "busId",
      "operator source destination busType departureTime arrivalTime",
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: populatedBooking,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();

    next(error);
  }
};
