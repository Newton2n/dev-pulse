import { pool } from "../../db";
import type { IIssue, IIssueAndUser } from "./issues-interface";
import getUserDetails from "../../utils/get-user-details";
import { promiseHooks } from "node:v8";

//create issue
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

export const getAllIssueFromDb = async () => {
  const getIssueResponse = await pool.query(
    `
        SELECT * FROM issues
        
        `,
  );

  const allIssues = getIssueResponse.rows;

  //   console.log("all issues", allIssues);
  const issuesPromises = allIssues.map(
    async (issue): Promise<IIssueAndUser> => {
      console.log("id", issue.reporter_id);

      const { reporter_id, created_at, updated_at, ...issueWithoutReporterId } =
        issue;

      const userDetails = await getUserDetails(reporter_id);

      console.log("users details", userDetails);

      return {
        ...issueWithoutReporterId,
        reporter: userDetails,
        created_at,
        updated_at,
      };
    },
  );
  const issuesWithUserDetails: IIssueAndUser[] =
    await Promise.all(issuesPromises);

  console.log(issuesWithUserDetails);
  return issuesWithUserDetails;
};

