import type { Response } from "express";

export type sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
) => Response;
export type sendError = (
  res: Response,
  statusCode: number,
  message?: string,
  errors?: unknown,
) => Response;
