import { configureStore } from "@reduxjs/toolkit";

import bookingReducer from "../features/booking/bookingSlice";
import authReducer from "../features/auth/authSlice";

const savedBooking = localStorage.getItem("busflow_booking");

const savedAuth = localStorage.getItem("busflow_auth");

const preloadedBookingState = savedBooking
  ? JSON.parse(savedBooking)
  : undefined;

const preloadedAuthState = savedAuth ? JSON.parse(savedAuth) : undefined;

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    auth: authReducer,
  },

  preloadedState: {
    ...(preloadedBookingState
      ? {
          booking: preloadedBookingState,
        }
      : {}),

    ...(preloadedAuthState
      ? {
          auth: preloadedAuthState,
        }
      : {}),
  },
});

store.subscribe(() => {
  const state = store.getState();

  localStorage.setItem("busflow_booking", JSON.stringify(state.booking));

  localStorage.setItem("busflow_auth", JSON.stringify(state.auth));
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
