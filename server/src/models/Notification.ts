import mongoose, { Document, Schema } from "mongoose";

export type NotificationType =
  | "message"
  | "booking"
  | "cancellation"
  | "payment"
  | "bus_update";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  referenceId: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["message", "booking", "cancellation", "payment", "bus_update"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    read: {
      type: Boolean,
      default: false,
    },

    referenceId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  userId: 1,
  read: 1,
  createdAt: -1,
});

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);

export default Notification;
