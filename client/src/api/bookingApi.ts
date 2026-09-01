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

export interface BookingBus {
  _id: string;
  operator: string;
  source: string;
  destination: string;
  busType: string;
  departureTime?: string;
  arrivalTime?: string;
}

export interface Booking {
  _id: string;

  busId: BookingBus;

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

interface MyBookingsResponse {
  success: boolean;
  message: string;
  data: Booking[];
}

export const createBooking = async (
  bookingData: CreateBookingData,
): Promise<Booking> => {
  const response = await api.post<BookingResponse>("/bookings", bookingData);

  return response.data.data;
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const response = await api.get<MyBookingsResponse>("/bookings/my");

  return response.data.data;
};

export const getBookingById = async (bookingId: string): Promise<Booking> => {
  const response = await api.get<BookingResponse>(`/bookings/${bookingId}`);

  return response.data.data;
};

export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  const response = await api.patch<BookingResponse>(
    `/bookings/${bookingId}/cancel`,
  );

  return response.data.data;
};
