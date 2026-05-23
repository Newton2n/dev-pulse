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


issuesRoute.post(
  "/",
  verifyJwtToken,
  authorizeRoles(["contributor", "maintainer"]),
  createIssueController,
); //create issue
issuesRoute.get("/", getAllIssuesController); //get all issues
issuesRoute.get("/:id", getSingleIssueController); //get single issues
issuesRoute.patch(
  "/:id",
  verifyJwtToken,
  authorizeRoles(["contributor", "maintainer"]),
  updateIssueController,
); //get single issues
issuesRoute.delete(
  "/:id",
  verifyJwtToken,
  authorizeRoles(["maintainer"]),
  deleteIssueController,
);

export default issuesRoute;
