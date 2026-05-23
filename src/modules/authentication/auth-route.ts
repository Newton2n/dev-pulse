import { Router } from "express";
import { signupController, loginController } from "./auth-controller";
const loginRoute = Router();

//signup route
loginRoute.post("/signup", signupController);

//signin route
loginRoute.post("/login", loginController);


export default loginRoute