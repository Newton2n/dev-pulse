import type { Request, Response } from "express";
import {
  createIssueIntoDb,
  deleteIssueFromDb,
  getAllIssueFromDb,
  getSingleIssueFromDb,
  updateIssueIntoDb,
} from "./issues-service";
import { errorResponse, successResponse } from "../../utils/send-response";
import { StatusCodes } from "http-status-codes";

//create issue controller

export const createIssueController = async (req: Request, res: Response) => {
  try {
    const user = req.userDetails;

    if (!user) {
      throw new Error("Authorization fail");
    }

    // create issue into db
    const issueCreateResponse = await createIssueIntoDb(req.body, user.id);

    successResponse(
      res,
      StatusCodes.CREATED,
      issueCreateResponse,
      "Issue created successfully",
    );
  } catch (error) {
    // check the error object is js standard error
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred when creating issue";

    errorResponse(res, StatusCodes.BAD_REQUEST, errorMessage, error);
  }
};

//get all issue controller

export const getAllIssuesController = async (req: Request, res: Response) => {
  try {
    // get all issues with reporter details
    const response = await getAllIssueFromDb();

    successResponse(res, StatusCodes.OK, response);
  } catch (error) {
    // check the error object is js standard error ;
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, error);
  }
};

//get single issue controller

export const getSingleIssueController = async (req: Request, res: Response) => {
  try {
    const issueId = req.params?.id;

    //get single issue with reporter details
    const response = await getSingleIssueFromDb(Number(issueId));

    successResponse(res, StatusCodes.OK, response);
  } catch (error) {
    // check the error object is js standard error ;
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred when fetching single issue";

    errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, error);
  }
};

//update issue controller

export const updateIssueController = async (req: Request, res: Response) => {
  try {
    const issueId = req.params?.id;

    // get user details from verifyJwtToken middleware
    const user = req.userDetails;

    if (!user) {
      throw new Error("Authorization fail");
    }

    const payload = req.body;

    //update issue service
    const updateIssueResponse = await updateIssueIntoDb(
      Number(issueId),
      user,
      payload,
    );

    successResponse(
      res,
      StatusCodes.OK,
      updateIssueResponse,
      "Issue updated successfully",
    );
  } catch (error) {
    // check the error object is js standard error ;
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred when updating issue";

    errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, error);
  }
};

// delete issue controller
export const deleteIssueController = async (req: Request, res: Response) => {
  try {
    const issueId = req.params?.id;
    console.log("issue id", issueId);
    const user = req.userDetails;
    if (!user || !issueId) {
      throw new Error("Authorization fail or No issue id");
    }

    //delete issue
    await deleteIssueFromDb(Number(issueId));

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    // check the error object is js standard error ;
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred when deleting issue";

    errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, error);
  }
};
