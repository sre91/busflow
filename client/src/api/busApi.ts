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

export const getBuses = async (): Promise<Bus[]> => {
  const response = await api.get<BusResponse>("/buses");

  return response.data.data;
};

export const getBusById = async (id: string): Promise<Bus> => {
  const response = await api.get<SingleBusResponse>(`/buses/${id}`);

  return response.data.data;
};
