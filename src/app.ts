import express, { urlencoded, type Application } from "express";
import loginRoute from "./modules/authentication/auth-route";
import issuesRoute from "./modules/issues/issues-route";
import cors from "cors";
const app: Application = express();

//accept all clients
app.use(cors());

//middleware
app.use(express.json());

//Authentication route
app.use("/api/auth", loginRoute);

//Issues route
app.use("/api/issues", issuesRoute);

export default app;
