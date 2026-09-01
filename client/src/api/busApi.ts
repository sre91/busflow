import api from "./axios";

export interface Bus {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

interface BusResponse {
  success: boolean;
  message: string;
  data: Bus[];
}

interface SingleBusResponse {
  success: boolean;
  message: string;
  data: Bus;
}

export const getBuses = async (params?: BusSearchParams): Promise<Bus[]> => {
  const response = await api.get<BusResponse>("/buses", {
    params,
  });

  return response.data.data;
};

export const getBusById = async (id: string): Promise<Bus> => {
  const response = await api.get<SingleBusResponse>(`/buses/${id}`);

  return response.data.data;
};

export interface BusSearchParams {
  source?: string;
  destination?: string;
  busType?: string;
}

export interface Seat {
  _id: string;
  busId: string;
  seatNumber: string;
  seatType: "seater" | "sleeper";
  status: "available" | "booked";
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface SeatResponse {
  success: boolean;
  message: string;
  data: Seat[];
}

export const getSeatsByBus = async (
  busId: string,
  journeyDate?: string,
): Promise<Seat[]> => {
  const response = await api.get<SeatResponse>(`/seats/${busId}`, {
    params: journeyDate
      ? {
          journeyDate,
        }
      : undefined,
  });

  return response.data.data;
};
