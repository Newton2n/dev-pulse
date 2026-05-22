import { Router } from "express";
import {
  createIssueController,
  getAllIssuesController,
} from "./issues-controller";

const issuesRoute = Router();

issuesRoute.post("/", createIssueController); //create issue
issuesRoute.get("/", getAllIssuesController); //create issue

export default issuesRoute;
