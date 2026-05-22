import jwt from "jsonwebtoken";
import config from "../config/dotenv";

const extractJwtToken = async (jwtToken: string) => {
  try {
    return jwt.verify(jwtToken, config.jwtSecret);
  } catch (error) {
    throw new Error("JWT verification failed");
  }
};

export default extractJwtToken;
