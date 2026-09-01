import axios from "axios";

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  seats?: string[];
};

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message;

    if (message) {
      return message;
    }

    if (error.response?.status === 409) {
      const seats = error.response.data?.seats;

      if (seats && seats.length > 0) {
        return `Seat(s) ${seats.join(", ")} are already booked.`;
      }

      return "One or more selected seats are already booked.";
    }

    if (error.response?.status === 404) {
      return "The requested resource was not found.";
    }

    if (error.response?.status === 400) {
      return "Some booking information is invalid.";
    }

    if (error.response?.status === 500) {
      return "Server error. Please try again later.";
    }

    return "Unable to complete the request.";
  }

  return "Something went wrong. Please try again.";
};
