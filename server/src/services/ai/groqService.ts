import Groq from "groq-sdk";

import env from "../../config/env.js";

import { BUSFLOW_SYSTEM_PROMPT } from "./aiPrompt.js";

import { validateTravelIntent, type TravelIntent } from "./travelIntent.js";

import type { ConversationMessage } from "./conversationContext.js";

import type { BookingIntent } from "./bookingAssistant.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

// Normal AI chat
export const generateAIResponse = async (
  userMessage: string,
  conversationHistory: ConversationMessage[] = [],
): Promise<string> => {
  // Keep only the most recent 6 messages.
  // This prevents the conversation from becoming too large.
  const recentHistory = conversationHistory
    .filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    )
    .slice(-6)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 1500),
    }));

  const messages = [
    {
      role: "system" as const,
      content: BUSFLOW_SYSTEM_PROMPT,
    },

    ...recentHistory,

    {
      role: "user" as const,
      content: userMessage.slice(0, 1500),
    },
  ];

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",

    messages,

    max_tokens: 800,
  });

  return (
    completion.choices[0]?.message?.content ||
    "Sorry, I could not generate a response."
  );
};

// Extract and validate travel intent
export const extractTravelIntent = async (
  userMessage: string,
): Promise<TravelIntent> => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",

        content: `
You are a travel intent extraction system for BusFlow.

Your job is to extract travel requirements
from the user's message.

Return ONLY valid JSON.

Use exactly this structure:

{
  "source": string | null,
  "destination": string | null,
  "date": string | null,
  "timePreference": "morning" | "afternoon" | "evening" | "night" | null,
  "busType": "AC Seater" | "AC Sleeper" | "Non-AC Seater" | "Non-AC Sleeper" | null,
  "budgetPreference": "cheap" | "moderate" | "premium" | null
}

Rules:

- If information is missing, use null.
- Never invent missing information.
- Extract cities when clearly mentioned.
- Extract the travel date when clearly mentioned.
- "cheap", "low cost", and "budget"
  should map to "cheap".
- "reasonable", "mid-range", and "average price"
  should map to "moderate".
- "expensive", "luxury", and "premium"
  should map to "premium".
- "morning", "afternoon", "evening",
  and "night" should be preserved.
- Extract bus type only when clearly mentioned.
- Return JSON only.
          `,
      },

      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const rawResponse = completion.choices[0]?.message?.content;

  if (!rawResponse) {
    throw new Error("AI returned an empty response");
  }

  let parsedData: unknown;

  try {
    parsedData = JSON.parse(rawResponse);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  return validateTravelIntent(parsedData);
};

// Extract booking intent
export const extractBookingIntent = async (
  userMessage: string,
): Promise<BookingIntent> => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",

        content: `
You are a booking intent extraction system
for BusFlow.

Extract what the user wants to do
with their bus booking.

Return ONLY valid JSON.

Use exactly this structure:

{
  "action": "search" | "select_bus" | "select_seats" | "confirm" | "cancel" | "unknown",
  "busId": string | null,
  "seatNumbers": string[],
  "confirmation": boolean
}

Rules:

- "search" means the user wants to find buses.
- "select_bus" means the user wants to choose
  a particular bus.
- "select_seats" means the user wants
  particular seats.
- "confirm" means the user clearly confirms
  a booking or booking-related action.
- "cancel" means the user wants to cancel
  the current booking process.
- "unknown" means the request does not clearly
  match any booking action.
- Never invent a bus ID.
- Only return a bus ID if the user clearly
  provides one.
- Extract seat numbers when clearly mentioned.
- Examples: A1, A2, B4, 12, 15.
- confirmation must be true only when the user
  clearly confirms.
- Return JSON only.
          `,
      },

      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const rawResponse = completion.choices[0]?.message?.content;

  if (!rawResponse) {
    throw new Error("AI returned an empty booking response");
  }

  let parsedData: unknown;

  try {
    parsedData = JSON.parse(rawResponse);
  } catch {
    throw new Error("AI returned invalid booking JSON");
  }

  if (
    typeof parsedData !== "object" ||
    parsedData === null ||
    Array.isArray(parsedData)
  ) {
    throw new Error("Invalid booking intent format");
  }

  const data = parsedData as Record<string, unknown>;

  const validActions = [
    "search",
    "select_bus",
    "select_seats",
    "confirm",
    "cancel",
    "unknown",
  ];

  if (typeof data.action !== "string" || !validActions.includes(data.action)) {
    throw new Error("Invalid booking action");
  }

  const busId =
    data.busId === null || typeof data.busId === "string" ? data.busId : null;

  const seatNumbers = Array.isArray(data.seatNumbers)
    ? data.seatNumbers.filter(
        (seat): seat is string => typeof seat === "string",
      )
    : [];

  const confirmation =
    typeof data.confirmation === "boolean" ? data.confirmation : false;

  return {
    action: data.action as BookingIntent["action"],

    busId,

    seatNumbers,

    confirmation,
  };
};
