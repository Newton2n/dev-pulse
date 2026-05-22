import { Router } from "express";
import {
  createIssueController,
  getAllIssuesController,
  getSingleIssueController,
  updateIssueController
} from "./issues-controller";

const issuesRoute = Router();

issuesRoute.post("/", createIssueController); //create issue
issuesRoute.get("/", getAllIssuesController); //get all issues
issuesRoute.get("/:id", getSingleIssueController); //get single issues
issuesRoute.patch("/:id", updateIssueController); //get single issues

export default issuesRoute;
