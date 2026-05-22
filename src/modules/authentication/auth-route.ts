import { Router } from "express";
import { signupController, loginController } from "./auth-controller";
const loginRoute = Router();

loginRoute.post("/signup", signupController);
loginRoute.post("/login", loginController);


export default loginRoute