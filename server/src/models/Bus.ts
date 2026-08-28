import mongoose, { Document, Schema } from "mongoose";

export interface IBus extends Document {
  operator: string;
  busType: "AC Seater" | "AC Sleeper" | "Non-AC Seater" | "Non-AC Sleeper";
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  totalSeats: number;
  availableSeats: number;
}

const busSchema = new Schema<IBus>(
  {
    operator: {
      type: String,
      required: true,
      trim: true,
    },

    busType: {
      type: String,
      required: true,
      enum: ["AC Seater", "AC Sleeper", "Non-AC Seater", "Non-AC Sleeper"],
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    departureTime: {
      type: String,
      required: true,
    },

    arrivalTime: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Bus = mongoose.model<IBus>("Bus", busSchema);

export default Bus;
