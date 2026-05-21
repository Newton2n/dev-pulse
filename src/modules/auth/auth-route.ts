import { Router} from "express";
import { loginController } from "./auth-controller";
export const loginRoute = Router();

loginRoute.post("/signup", loginController)