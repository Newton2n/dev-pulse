import type { IUser } from "./auth-interface";
import { pool } from "../../db/index";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config/dotenv";

//signup service
export const signupIntoDb = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new Error("All payload field required");
  }

  const hashedPassword = await bcrypt.hash(password, 10); //hash password

  const userRole = role || "contributor"; // fallback if client do not give role

  const response = await pool.query(
    `
        INSERT INTO users (name,email,password,role)
        VALUES($1,$2,$3,$4)
        RETURNING *
        `,
    [name, email, hashedPassword, userRole], // data base query for signup
  );

  delete response?.rows[0]?.password; // delete password field before return

  return response?.rows[0];
};

//log in service
export const loginIntoDb = async (payload: Omit<IUser, "name" | "role">) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("All payload are required");
  }

  const checkUserFromDb = await pool.query(
    `
  SELECT * FROM users
  WHERE email =$1
  `,
    [email],
  );

  if (checkUserFromDb?.rows?.length === 0) {
    throw new Error("Invalid credential");
  }

  const user = checkUserFromDb?.rows[0];

  const comparePassword = await bcrypt.compare(password, user.password); //check password

  if (!comparePassword) {
    throw new Error("Invalid credential");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  } as JwtPayload; // jwt payload

  const jwtSignToken = jwt.sign(jwtPayload, config.jwtSecret); // generate jwt token

  delete user.password; // delete user password before response

  return {
    token: jwtSignToken,
    user: user,
  };
};
