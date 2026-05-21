import express, {
    urlencoded,
  type Application
} from "express";
import { loginRoute } from "./modules/auth/auth-route";

const app: Application = express();


//middleware
app.use(express.json());



app.use("/api/auth", loginRoute);

export default app;
