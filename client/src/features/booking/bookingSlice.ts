import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Passenger = {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
};

type BookingState = {
  busId: string | null;
  busOperator: string;
  source: string;
  destination: string;

  journeyDate: string;

  selectedSeats: string[];

  totalAmount: number;

  passenger: Passenger | null;
};

const initialState: BookingState = {
  busId: null,
  busOperator: "",
  source: "",
  destination: "",

  journeyDate: "",

  selectedSeats: [],

  totalAmount: 0,

  passenger: null,
};

const bookingSlice = createSlice({
  name: "booking",

  initialState,

  reducers: {
    setBookingBus: (
      state,
      action: PayloadAction<{
        busId: string;
        busOperator: string;
        source: string;
        destination: string;
      }>,
    ) => {
      state.busId = action.payload.busId;
      state.busOperator = action.payload.busOperator;
      state.source = action.payload.source;
      state.destination = action.payload.destination;
    },

    setJourneyDate: (state, action: PayloadAction<string>) => {
      state.journeyDate = action.payload;
    },

    setSelectedSeats: (
      state,
      action: PayloadAction<{
        seats: string[];
        totalAmount: number;
      }>,
    ) => {
      state.selectedSeats = action.payload.seats;
      state.totalAmount = action.payload.totalAmount;
    },

    setPassenger: (state, action: PayloadAction<Passenger>) => {
      state.passenger = action.payload;
    },

    clearBooking: (state) => {
      state.busId = null;
      state.busOperator = "";
      state.source = "";
      state.destination = "";
      state.journeyDate = "";
      state.selectedSeats = [];
      state.totalAmount = 0;
      state.passenger = null;
    },
  },
});

export const {
  setBookingBus,
  setJourneyDate,
  setSelectedSeats,
  setPassenger,
  clearBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
