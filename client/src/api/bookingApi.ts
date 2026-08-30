import api from "./axios";

export interface CreateBookingData {
  busId: string;
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
}

export interface Booking {
  _id: string;
  busId: string;
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
  createdAt: string;
  updatedAt: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export const createBooking = async (
  bookingData: CreateBookingData,
): Promise<Booking> => {
  const response = await api.post<BookingResponse>("/bookings", bookingData);

  return response.data.data;
};
