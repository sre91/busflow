import api from "./axios";

// Conversation message
export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

// Bus returned by AI search
export interface AIBus {
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
}

// Travel intent
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

// AI chat response
interface AIChatResponse {
  success: boolean;
  message: string;
}

// AI search response
interface AISearchResponse {
  success: boolean;

  data: {
    intent: TravelIntent;
    buses: AIBus[];
    count: number;
    recommendation: string;
  };
}

// Send normal AI chat message
export const sendAIMessage = async (
  message: string,
  conversationHistory: ConversationMessage[] = [],
): Promise<string> => {
  const response = await api.post<AIChatResponse>("/ai/chat", {
    message,
    conversationHistory,
  });

  return response.data.message;
};

// Search buses using AI
export const searchBusesWithAI = async (
  message: string,
): Promise<AISearchResponse["data"]> => {
  const response = await api.post<AISearchResponse>("/ai/search", {
    message,
  });

  return response.data.data;
};
