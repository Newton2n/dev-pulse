import { pool } from "../../db";
import type { IIssue } from "./issues-interface";

export const createIssueIntoDb = async (payload: IIssue, userId: number) => {
  const { title, description, type } = payload;

  if (!title || !description || !type) {
    throw new Error(
      "Missing required fields: title, description, and type are required",
    );
  }

  const createIssue = await pool.query(
    `
   INSERT INTO issues (title,description,type,status,reporter_id)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
    `,
    [title, description, type, "open", userId],
  );

  if (!createIssue.rows[0]) {
    throw new Error("Something went wrong to create issue");
  }


  return createIssue.rows[0];
};
