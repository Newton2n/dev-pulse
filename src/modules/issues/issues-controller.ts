import type { Request, Response } from "express";
import {
  createIssueIntoDb,
  getAllIssueFromDb,
  getSingleIssueFromDb,
  updateIssueIntoDb,
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
    const response = await getAllIssueFromDb(); // get all issues with reporter details

    successResponse(res, StatusCodes.OK, response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error ;

    errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, error);
  }
};

export const getSingleIssueController = async (req: Request, res: Response) => {
  try {
    const issueId = req.params?.id;

    const response = await getSingleIssueFromDb(Number(issueId)); //get single issue with reporter details

    successResponse(res, StatusCodes.OK, response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error ;

    errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, error);
  }
};

// Maintainer (any issue) OR Contributor (own issue, only if status is open)

// {
//   "title": "Updated: Database pool exhaustion fix needed",
//   "description": "Updated description with reproduction steps...",
//   "type": "bug"
// }
export const updateIssueController = async (req: Request, res: Response) => {
  try {
    const headers = req.headers;
    const issueId = req.params?.id;
    console.log("issue id", issueId);
    if (!headers.authorization || !issueId) {
      throw new Error("Authorization token and issue id required");
    }
    const payload = req.body;

    const updateIssue = await updateIssueIntoDb(
      Number(issueId),
      headers.authorization,
      payload,
    );

    console.log("update issue", updateIssue);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error ;

    errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, error);
  }
};
