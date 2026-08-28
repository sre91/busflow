import { Request, Response, NextFunction } from "express";

import Bus from "../models/Bus.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getBuses = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const buses = await Bus.find();

    sendSuccess(res, buses, "Buses fetched successfully");
  } catch (error) {
    next(error);
  }
};
