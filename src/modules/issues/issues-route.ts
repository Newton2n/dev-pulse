import { Router } from "express";
import {
  createIssueController,
  deleteIssueController,
  getAllIssuesController,
  getSingleIssueController,
  updateIssueController,
} from "./issues-controller";

import {
  verifyJwtToken,
  authorizeRoles,
} from "../../middlewares/auth-middleware";



const issuesRoute = Router();

//create issue
issuesRoute.post(
  "/",
  verifyJwtToken,
  authorizeRoles(["contributor", "maintainer"]),
  createIssueController,
);

//get all issues
issuesRoute.get("/", getAllIssuesController);

//get single issues
issuesRoute.get("/:id", getSingleIssueController);

//update issues
// added two middleware to check authorization header and roles
issuesRoute.patch(
  "/:id",
  verifyJwtToken,
  authorizeRoles(["contributor", "maintainer"]),
  updateIssueController,
);

//delete issue
// added two middleware to check authorization header and role
issuesRoute.delete(
  "/:id",
  verifyJwtToken,
  authorizeRoles(["maintainer"]),
  deleteIssueController,
);

export default issuesRoute;
