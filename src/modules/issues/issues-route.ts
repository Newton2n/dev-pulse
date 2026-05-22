import { Router } from "express";
import {
  createIssueController,
  getAllIssuesController,
} from "./issues-controller";

const issuesRoute = Router();

issuesRoute.post("/", createIssueController); //create issue
issuesRoute.get("/", getAllIssuesController); //get all issues

export default issuesRoute;
