import { Request, Response, NextFunction } from "express";

import {
  generateAIResponse,
  extractTravelIntent,
  extractBookingIntent,
} from "../services/ai/groqService.js";

import { searchBusesFromIntent } from "../services/busSearchService.js";

import { generateBusRecommendations } from "../services/ai/recommendationService.js";

// Normal AI chat
export const chatWithAI = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message, conversationHistory } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid message is required",
      });
    }

    const history = Array.isArray(conversationHistory)
      ? conversationHistory.filter(
          (item) =>
            item &&
            (item.role === "user" || item.role === "assistant") &&
            typeof item.content === "string",
        )
      : [];

    const aiResponse = await generateAIResponse(message.trim(), history);

    return res.status(200).json({
      success: true,
      message: aiResponse,
    });
  } catch (error) {
    next(error);
  }
};

// Extract travel intent
export const extractIntent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid message is required",
      });
    }

    const intent = await extractTravelIntent(message.trim());

    return res.status(200).json({
      success: true,
      data: intent,
    });
  } catch (error) {
    next(error);
  }
};

// AI-powered bus search
export const searchWithAI = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid message is required",
      });
    }

    const intent = await extractTravelIntent(message.trim());

    const buses = await searchBusesFromIntent(intent);

    const recommendation = await generateBusRecommendations(buses, intent);

    return res.status(200).json({
      success: true,

      data: {
        intent,
        buses,
        count: buses.length,
        recommendation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// AI booking assistance
export const bookingAssist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid message is required",
      });
    }

    const bookingIntent = await extractBookingIntent(message.trim());

    return res.status(200).json({
      success: true,

      data: {
        bookingIntent,

        message: getBookingAssistantMessage(bookingIntent.action),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Generate a safe response based on
// the booking action.
const getBookingAssistantMessage = (
  action:
    | "search"
    | "select_bus"
    | "select_seats"
    | "confirm"
    | "cancel"
    | "unknown",
): string => {
  switch (action) {
    case "search":
      return "I can help you find suitable buses.";

    case "select_bus":
      return "Great. Please review the selected bus before continuing.";

    case "select_seats":
      return "Great. Please review your selected seats before continuing.";

    case "confirm":
      return "Your confirmation is noted. Please complete the booking through the BusFlow booking flow.";

    case "cancel":
      return "Okay. I will stop the current booking assistance.";

    default:
      return "I can help you search for buses, select a bus, choose seats, or continue with your booking.";
  }
};
