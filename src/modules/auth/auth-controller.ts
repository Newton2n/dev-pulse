import type { Request, Response } from "express";
import { signupInDb } from "./auth-service";
import { successResponse, errorResponse } from "../../utils/send-response";

import { StatusCodes, getReasonPhrase } from "http-status-codes";

export const loginController = async (req: Request, res: Response) => {
  try {
    const response = await signupInDb(req.body);

    successResponse(
      res,
      StatusCodes.CREATED,
      response,
      "User registered successfully",
    );
  } catch (error: unknown) {
    errorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      getReasonPhrase(StatusCodes.BAD_REQUEST),
      error,
    );
  }
};
