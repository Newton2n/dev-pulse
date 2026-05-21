import type { IUser } from "./auth-interface";
import { pool } from "../../db/index";
import bcrypt from "bcrypt";
export const signupInDb = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  if (!name && !email && !password) {
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
