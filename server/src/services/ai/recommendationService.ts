import Groq from "groq-sdk";

import env from "../../config/env.js";

import type { TravelIntent } from "./travelIntent.js";

interface RecommendationBus {
  _id: string;
  operator: string;
  busType: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  availableSeats: number;
}

// Groq client

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

// Generate bus recommendations

export const generateBusRecommendations = async (
  buses: RecommendationBus[],
  intent: TravelIntent,
): Promise<string> => {
  if (buses.length === 0) {
    return "I could not find any buses matching your preferences.";
  }

  const recommendationBuses = buses.slice(0, 8);

  const busInformation = recommendationBuses.map((bus) => ({
    id: bus._id.toString(),
    operator: bus.operator,
    busType: bus.busType,
    source: bus.source,
    destination: bus.destination,
    departureTime: bus.departureTime,
    arrivalTime: bus.arrivalTime,
    duration: bus.duration,
    price: bus.price,
    rating: bus.rating,
    availableSeats: bus.availableSeats,
  }));

  // Ask Groq for recommendation

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",

        content: `
You are BusFlow AI, a bus recommendation assistant.

Your job is to recommend suitable buses
from the REAL buses provided to you.

IMPORTANT RULES:

- Only recommend buses from the provided list.
- Never invent a bus.
- Never invent a price.
- Never invent a rating.
- Never invent seat availability.
- Never modify bus information.
- Consider the user's travel preferences.
- Consider price, rating, bus type,
  departure time, and available seats.
- Keep the response concise and helpful.
- If multiple buses are suitable,
  mention the best options.
- If no buses are suitable,
  clearly say so.

The user travel intent is:

${JSON.stringify(intent)}

The available BusFlow buses are:

${JSON.stringify(busInformation)}

FORMAT RULES:

- Do NOT use Markdown tables.
- Do NOT use pipe characters (|).
- Do NOT use table headers.
- Use short paragraphs or bullet points.
- Make each bus easy to scan.
- Use emojis where helpful.
- Keep each bus recommendation compact.

Example format:

🚌 Royal Roadways
Chennai → Bangalore
🪑 Non-AC Seater
🕐 Departure: 02:00 PM
💰 ₹699
⭐ Rating: 4.7
💺 28 seats available

Give a natural-language recommendation
for the user.
        `,
      },

      {
        role: "user",
        content: "Recommend the best bus for me.",
      },
    ],

    // Keep the generated response small.
    max_tokens: 300,
  });

  return (
    completion.choices[0]?.message?.content ||
    "I found some buses, but I could not generate a recommendation."
  );
};
