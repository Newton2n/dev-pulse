import type { Request, Response } from "express";
import { loginIntoDb, signupIntoDb } from "./auth-service";
import { successResponse, errorResponse } from "../../utils/send-response";

import { StatusCodes } from "http-status-codes";

//signup controller
export const signupController = async (req: Request, res: Response) => {
  try {
    const response = await signupIntoDb(req.body);

    successResponse(
      res,
      StatusCodes.CREATED,
      response,
      "User registered successfully",
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error

    errorResponse(res, StatusCodes.BAD_REQUEST, errorMessage, error); // send error response
  }
};

//log in controller
export const loginController = async (req: Request, res: Response) => {
  try {
    const response = await loginIntoDb(req.body); // signin response

    successResponse(res, StatusCodes.OK, response, "Login successful"); // send success response
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error

    errorResponse(res, StatusCodes.NOT_FOUND, errorMessage, error); // send error response
  }
};
