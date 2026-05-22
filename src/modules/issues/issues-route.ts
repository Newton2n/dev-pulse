import { Router } from "express";
import {
  createIssueController,
  getAllIssuesController,
  getSingleIssue
} from "./issues-controller";

const issuesRoute = Router();

issuesRoute.post("/", createIssueController); //create issue
issuesRoute.get("/", getAllIssuesController); //get all issues
issuesRoute.get("/:id", getSingleIssue); //get single issues

export default issuesRoute;
