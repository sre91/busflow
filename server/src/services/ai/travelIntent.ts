export interface TravelIntent {
  source: string | null;

  destination: string | null;

  date: string | null;

  timePreference: "morning" | "afternoon" | "evening" | "night" | null;

  busType:
    | "AC Seater"
    | "AC Sleeper"
    | "Non-AC Seater"
    | "Non-AC Sleeper"
    | null;

  budgetPreference: "cheap" | "moderate" | "premium" | null;
}

// Check whether a value is a valid time preference
const isValidTimePreference = (
  value: unknown,
): value is TravelIntent["timePreference"] => {
  return (
    value === null ||
    value === "morning" ||
    value === "afternoon" ||
    value === "evening" ||
    value === "night"
  );
};

// Check whether a value is a valid bus type
const isValidBusType = (value: unknown): value is TravelIntent["busType"] => {
  return (
    value === null ||
    value === "AC Seater" ||
    value === "AC Sleeper" ||
    value === "Non-AC Seater" ||
    value === "Non-AC Sleeper"
  );
};

// Check whether a value is a valid budget preference
const isValidBudgetPreference = (
  value: unknown,
): value is TravelIntent["budgetPreference"] => {
  return (
    value === null ||
    value === "cheap" ||
    value === "moderate" ||
    value === "premium"
  );
};

// Validate and normalize AI-generated travel intent
export const validateTravelIntent = (data: unknown): TravelIntent => {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("Invalid travel intent format");
  }

  const intent = data as Record<string, unknown>;

  const source =
    intent.source === null || typeof intent.source === "string"
      ? intent.source
      : null;

  const destination =
    intent.destination === null || typeof intent.destination === "string"
      ? intent.destination
      : null;

  const date =
    intent.date === null || typeof intent.date === "string"
      ? intent.date
      : null;

  if (!isValidTimePreference(intent.timePreference)) {
    throw new Error("Invalid time preference");
  }

  if (!isValidBusType(intent.busType)) {
    throw new Error("Invalid bus type");
  }

  if (!isValidBudgetPreference(intent.budgetPreference)) {
    throw new Error("Invalid budget preference");
  }

  return {
    source,
    destination,
    date,
    timePreference: intent.timePreference,
    busType: intent.busType,
    budgetPreference: intent.budgetPreference,
  };
};
