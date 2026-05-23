import type { NextFunction, Request, Response } from "express";
import extractJwtToken from "../utils/extract-jwt-token";
import { errorResponse } from "../utils/send-response";
import { StatusCodes } from "http-status-codes";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/dotenv";
import type { IUserTokenPayload } from "../modules/issues/issues-interface";

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

    req.userDetails = verify as IUserTokenPayload;

    console.log("verify token", verify);
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Jwt token verified fail"; // check the error object is js standard error ;

    errorResponse(res, StatusCodes.UNAUTHORIZED, errorMessage, error);
  }
};

export const authorizeRoles = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.userDetails;

      if (!user) {
        throw new Error("Authorization fail");
      }

      if (allowedRoles.includes(user.role)) {
        next();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authorized failed"; // check the error object is js standard error ;

      errorResponse(res, StatusCodes.UNAUTHORIZED, errorMessage, error);
    }
  };
};
