import express, { urlencoded, type Application } from "express";
import loginRoute from "./modules/authentication/auth-route";
import issuesRoute from "./modules/issues/issues-route";

const app: Application = express();

//middleware
app.use(express.json());

app.use("/api/auth", loginRoute); //Authentication route

app.use("/api/issues", issuesRoute); //Issues route

export default app;
