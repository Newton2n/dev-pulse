import { pool } from "../../db";
import type { IIssue, IIssueAndReporter, IReporter } from "./issues-interface";
import getUserDetails from "../../utils/get-user-details";

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

// get all issues
export const getAllIssueFromDb = async () => {
  const getIssueResponse = await pool.query(
    `
        SELECT * FROM issues
        
        `,
  ); // get all issues from issues table

  const allIssues = getIssueResponse.rows; //all issues

  const issuesPromises = allIssues.map(
    async (issue): Promise<IIssueAndReporter> => {
      const { reporter_id, created_at, updated_at, ...issueWithoutReporterId } =
        issue; // extract issue obj

      const userDetails: IReporter = await getUserDetails(reporter_id); // get single user details (id,name,role)

      return {
        ...issueWithoutReporterId,
        reporter: userDetails,
        created_at,
        updated_at,
      }; // return issue obj with reporter details
    },
  );
  const issuesWithUserDetails: IIssueAndReporter[] =
    await Promise.all(issuesPromises); // wait until all issuesPromise resolve

  return issuesWithUserDetails;
};

export const getSingleIssueFromDb = async (issueId: number) => {
  if (!issueId) {
    throw new Error("Missing required field: issue id required");
  }

  const getIssueDetails = await pool.query(
    `
    SELECT * FROM issues
    WHERE id =$1
    `,
    [issueId],
  );

  if (getIssueDetails.rows.length === 0) {
    throw new Error(`Issue with ID ${issueId} not found`);
  }

  const { reporter_id, created_at, updated_at, ...restItems } =
    getIssueDetails.rows[0]; //extract information

  const getReporterDetails: IReporter = await getUserDetails(reporter_id); //get reporter details (id,name,role)

  return {
    ...restItems,
    reporter: getReporterDetails,
    created_at,
    updated_at,
  };
};
