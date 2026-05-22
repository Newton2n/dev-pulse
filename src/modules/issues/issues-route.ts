import { Router } from "express";
import { createIssue } from "./issues-controller";

const issuesRoute = Router();

issuesRoute.post("/", createIssue); //create issue

export default issuesRoute;
