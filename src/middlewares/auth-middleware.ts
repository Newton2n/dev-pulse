import type { NextFunction, Request, Response } from "express";
import extractJwtToken from "../utils/extract-jwt-token";
import { errorResponse } from "../utils/send-response";
import { StatusCodes } from "http-status-codes";
import type { IUserTokenPayload } from "../modules/issues/issues-interface";

// verify jwt token and slapped user details into req object
export const verifyJwtToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const headers = req.headers;
    if (!headers.authorization) {
      throw new Error("Authorization token required");
    }

    const verify = await extractJwtToken(headers.authorization);

    //slapped the user details into request object
    req.userDetails = verify as IUserTokenPayload;

    next();
  } catch (error) {
    //check the error object is js standard error ;
    const errorMessage =
      error instanceof Error ? error.message : "Jwt token verified fail";

    errorResponse(res, StatusCodes.UNAUTHORIZED, errorMessage, error);
  }
};

//authorize role
export const authorizeRoles = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.userDetails;

      if (!user) {
        throw new Error("Authorization fail");
      }

      if (!allowedRoles.includes(user.role)) {
        throw new Error("Forbidden: You do not have permission");
      }

      next();
    } catch (error) {
      // check the error object is js standard error ;
      const errorMessage =
        error instanceof Error ? error.message : "Authorized failed";

      errorResponse(res, StatusCodes.UNAUTHORIZED, errorMessage, error);
    }
  };
};
