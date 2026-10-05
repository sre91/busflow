export type BookingAction =
  | "search"
  | "select_bus"
  | "select_seats"
  | "confirm"
  | "cancel"
  | "unknown";

export interface BookingIntent {
  action: BookingAction;
  busId: string | null;
  seatNumbers: string[];
  confirmation: boolean;
}
