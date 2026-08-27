import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("❌ Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
};

export default errorMiddleware;
