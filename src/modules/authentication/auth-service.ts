import type { IUser } from "./auth-interface";
import { pool } from "../../db/index";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config/dotenv";

//signup service
export const signupIntoDb = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new Error(
      "Missing required fields: name, email, and password are required",
    );
  }
  //hash password with 10 salt round
  const hashedPassword = await bcrypt.hash(password, 10); 

 // fallback if client do not give role field
  const userRole = role || "contributor"; 

  // data base query for signup
  const response = await pool.query(
    `
        INSERT INTO users (name,email,password,role)
        VALUES($1,$2,$3,$4)
        RETURNING *
        `,
    [name, email, hashedPassword, userRole], 
  );

 // delete password field before return
  delete response?.rows[0]?.password; 

  return response?.rows[0];
};

//log in service
export const loginIntoDb = async (payload: Omit<IUser, "name" | "role">) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("Missing required fields: email and password are required");
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

  //compare hash and given  password 
  const comparePassword = await bcrypt.compare(password, user.password); 

  if (!comparePassword) {
    throw new Error("Invalid credential");
  }

  // jwt payload
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  } as JwtPayload; 


  // generate jwt token
  const jwtSignToken = jwt.sign(jwtPayload, config.jwtSecret, {
    expiresIn: "30d",
  }); 

  // delete user password before response
  delete user.password; 

  return {
    token: jwtSignToken,
    user: user,
  };
};
