import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("❌ Server error:", error);

  if (res.headersSent) {
    next(error);
    return;
  }

  const message =
    error instanceof Error ? error.message : "Internal server error";

  return res.status(500).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
