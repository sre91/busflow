import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = "Request successful",
) => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};
