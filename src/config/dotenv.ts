import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  connectionString: process.env.DATABASE_CONNECTION_STRING as string,
  jwtSecret: process.env.JWT_SECRET_STRING as string,
};

export default config;
