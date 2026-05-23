import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import loginRoute from "./modules/authentication/auth-route";
import issuesRoute from "./modules/issues/issues-route";
import cors from "cors";
import { errorResponse } from "./utils/send-response";
const app: Application = express();

//accept all clients
app.use(cors());

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Authentication route
app.use("/api/auth", loginRoute);

//Issues route
app.use("/api/issues", issuesRoute);

//Handle Global Route Not Found 
app.use((req: Request, res: Response) => {
  errorResponse(
    res,
    404,
    "Requested resource does not exist",
    `Cannot ${req.method} ${req.url}`,
  );
});

//Centralized Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorResponse(
    res,
    500,
    "Unexpected server or database error",
    err.message || "Internal Server Error",
  );
});

export default app;
