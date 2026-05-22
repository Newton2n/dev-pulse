import type { Request, Response } from "express";
import {
  createIssueIntoDb,
  getAllIssueFromDb,
  getSingleIssueFromDb,
} from "./issues-service";
import extractJwtToken from "../../utils/extract-jwt-token";
import type { IIssueAndReporter, IUserTokenPayload } from "./issues-interface";
import { errorResponse, successResponse } from "../../utils/send-response";
import { StatusCodes } from "http-status-codes";

//create issue controller
export const createIssueController = async (req: Request, res: Response) => {
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
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error

    errorResponse(res, StatusCodes.BAD_REQUEST, errorMessage, error);
  }
};

//get all issue

export const getAllIssuesController = async (req: Request, res: Response) => {
  try {
    const response: IIssueAndReporter[] = await getAllIssueFromDb(); // get all issues with reporter details

    successResponse(res, StatusCodes.OK, response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error ;

    errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, error);
  }
};

export const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const issueId = req.params?.id; 

    const response: IIssueAndReporter = await getSingleIssueFromDb(
      Number(issueId),
    ); //get single issue with reporter details

    successResponse(res, StatusCodes.OK, response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error ;

    errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, error);
  }
};
