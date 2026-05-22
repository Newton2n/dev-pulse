import type { Request, Response } from "express";
import { createIssueIntoDb } from "./issues-service";
import extractJwtToken from "../../utils/extract-jwt-token";
import type { IUserTokenPayload } from "./issues-interface";
import { errorResponse, successResponse } from "../../utils/send-response";
import { StatusCodes } from "http-status-codes";

export const createIssue = async (req: Request, res: Response) => {
  try {
    const headers = req.headers;
    if (!headers.authorization) {
      throw new Error("Authorization token required");
    }

    const decodeJwtToken = (await extractJwtToken(
      headers.authorization as string,
    )) as IUserTokenPayload; // verify jwt token and decode details

    if (!["contributor", "maintainer"].includes(decodeJwtToken.role)) {
      throw new Error("Authorization failed");
    }

    const issueCreateResponse = await createIssueIntoDb(
      req.body,
      decodeJwtToken.id,
    ); // create issue into db

    successResponse(
      res,
      StatusCodes.CREATED,
      issueCreateResponse,
      "Issue created successfully",
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong"; //check error

    errorResponse(res, StatusCodes.BAD_REQUEST, errorMessage, error);
  }
};
