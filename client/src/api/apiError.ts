import axios from "axios";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  seats?: string[];
};

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const status = error.response?.status;

    const message = error.response?.data?.message;

    const seats = error.response?.data?.seats;

    // Seat conflict
    if (status === 409) {
      if (seats && seats.length > 0) {
        return `Seat(s) ${seats.join(
          ", ",
        )} are already booked. Please select another seat.`;
      }

      return message || "One or more selected seats are already booked.";
    }

    // Authentication
    if (status === 401) {
      return message || "Please login to continue.";
    }

    // Validation
    if (status === 400) {
      return message || "Some booking information is invalid.";
    }

    // Not found
    if (status === 404) {
      return message || "The requested resource was not found.";
    }

    // Server error
    if (status === 500) {
      return message || "Server error. Please try again later.";
    }

    // Any other API error
    if (message) {
      return message;
    }

    return "Unable to complete the request.";
  }

  return "Something went wrong. Please try again.";
};

export const isSeatConflictError = (error: unknown): boolean => {
  return (
    axios.isAxiosError<ApiErrorResponse>(error) &&
    error.response?.status === 409
  );
};
