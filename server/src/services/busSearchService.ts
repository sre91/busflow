import Bus from "../models/Bus.js";

import type { TravelIntent } from "./ai/travelIntent.js";

import { getCache, setCache } from "./cacheService.js";

interface CachedBus {
  _id: string;
  operator: string;
  source: string;
  destination: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  totalSeats: number;
  availableSeats: number;
}

export const searchBusesFromIntent = async (intent: TravelIntent) => {
  const cacheKey = `bus-search:${JSON.stringify(intent)}`;

  try {
    const cached = await getCache<CachedBus[]>(cacheKey);

    if (cached) {
      console.log("⚡ Bus search cache hit");

      return applyPreferences(cached, intent);
    }

    console.log("🔎 Bus search cache miss");
  } catch (error) {
    console.error("❌ Redis cache read error:", error);
  }

  const filter: Record<string, unknown> = {};

  if (intent.source) {
    filter.source = {
      $regex: `^${intent.source}$`,
      $options: "i",
    };
  }

  if (intent.destination) {
    filter.destination = {
      $regex: `^${intent.destination}$`,
      $options: "i",
    };
  }

  if (intent.busType) {
    filter.busType = intent.busType;
  }

  filter.availableSeats = {
    $gt: 0,
  };

  const buses = await Bus.find(filter);

  const busData: CachedBus[] = buses.map((bus) => ({
    _id: bus._id.toString(),

    operator: bus.operator,

    source: bus.source,

    destination: bus.destination,

    busType: bus.busType,

    departureTime: bus.departureTime,

    arrivalTime: bus.arrivalTime,

    duration: bus.duration,

    price: bus.price,

    rating: bus.rating,

    totalSeats: bus.totalSeats,

    availableSeats: bus.availableSeats,
  }));

  try {
    await setCache(cacheKey, busData, 30);

    console.log("💾 Bus search cached for 30 seconds");
  } catch (error) {
    console.error("❌ Redis cache write error:", error);
  }

  return applyPreferences(busData, intent);
};

const applyPreferences = (
  buses: CachedBus[],
  intent: TravelIntent,
): CachedBus[] => {
  const sortedBuses = [...buses];

  if (intent.budgetPreference === "cheap") {
    sortedBuses.sort((a, b) => a.price - b.price);
  }

  if (intent.budgetPreference === "premium") {
    sortedBuses.sort((a, b) => b.price - a.price);
  }

  if (intent.budgetPreference === "moderate") {
    sortedBuses.sort((a, b) => a.price - b.price);
  }

  const timePreference = intent.timePreference;

  if (timePreference !== null) {
    const filteredByTime = sortedBuses.filter((bus) =>
      matchesTimePreference(bus.departureTime, timePreference),
    );

    if (filteredByTime.length > 0) {
      return filteredByTime;
    }
  }

  return sortedBuses;
};

const matchesTimePreference = (
  departureTime: string,
  timePreference: "morning" | "afternoon" | "evening" | "night",
): boolean => {
  const match = departureTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return false;
  }

  let hour = Number(match[1]);

  const period = match[3].toUpperCase();

  if (period === "AM") {
    if (hour === 12) {
      hour = 0;
    }
  } else {
    if (hour !== 12) {
      hour += 12;
    }
  }

  switch (timePreference) {
    case "morning":
      return hour >= 5 && hour < 12;

    case "afternoon":
      return hour >= 12 && hour < 17;

    case "evening":
      return hour >= 17 && hour < 21;

    case "night":
      return hour >= 21 || hour < 5;

    default:
      return false;
  }
};
