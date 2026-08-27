import { NextFunction, Request, Response } from "express";

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);

  next();
};

export default requestLogger;
