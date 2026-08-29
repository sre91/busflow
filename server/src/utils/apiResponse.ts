import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = "Request successful",
  statusCode = 200,
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
