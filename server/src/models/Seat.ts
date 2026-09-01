import mongoose, { Schema } from "mongoose";

export interface ISeat {
  busId: mongoose.Types.ObjectId;
  seatNumber: string;
  seatType: "seater" | "sleeper";
  status: "available" | "booked";
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const seatSchema = new Schema<ISeat>(
  {
    busId: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    seatType: {
      type: String,
      required: true,
      enum: ["seater", "sleeper"],
    },

    status: {
      type: String,
      required: true,
      enum: ["available", "booked"],
      default: "available",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

seatSchema.index(
  {
    busId: 1,
    seatNumber: 1,
  },
  {
    unique: true,
  },
);

const Seat = mongoose.model<ISeat>("Seat", seatSchema);

export default Seat;
