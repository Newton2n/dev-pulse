import { Router } from "express";
import { signupController, loginController } from "./auth-controller";
export const loginRoute = Router();

loginRoute.post("/signup", signupController);
loginRoute.post("/login", loginController);
