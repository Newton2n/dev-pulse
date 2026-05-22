import type { Response } from "express";
import { type sendSuccess, type sendError } from "../types/response";

//success response

export const successResponse: sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message?: string,
) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};

//Error response

export const errorResponse: sendError = (
  res: Response,
  statusCode: number,
  message: string = "Something went wrong",
  errors: unknown,
) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,
  });
};
