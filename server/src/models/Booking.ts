import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  busId: mongoose.Types.ObjectId;
  passenger: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
  };
  seats: string[];
  totalAmount: number;
  paymentMethod: "card" | "upi";
  paymentStatus: "pending" | "paid" | "failed";
  bookingStatus: "confirmed" | "cancelled";
}

const bookingSchema = new Schema<IBooking>(
  {
    busId: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    passenger: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      age: {
        type: Number,
        required: true,
        min: 1,
        max: 120,
      },

      gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"],
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
    },

    seats: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "At least one seat is required",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "upi"],
    },

    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    bookingStatus: {
      type: String,
      required: true,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
