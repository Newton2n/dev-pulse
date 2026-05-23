import { pool } from "../../db";
import type {
  IIssue,
  IIssueAndReporter,
  IReporter,
  IUserTokenPayload,
  TIssueUpdatePayload,
} from "./issues-interface";
import getUserDetails from "../../utils/get-user-details";
import getIssueDetails from "../../utils/get-issue-details";
import extractJwtToken from "../../utils/extract-jwt-token";

//create issue
export const createIssueIntoDb = async (
  payload: IIssue,
  userId: number,
): Promise<Omit<IIssueAndReporter, "reporter">> => {
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
export const getAllIssueFromDb = async (): Promise<IIssueAndReporter[]> => {
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

//get single issue from db
export const getSingleIssueFromDb = async (
  issueId: number,
): Promise<IIssueAndReporter> => {
  if (!issueId) {
    throw new Error("Missing required field: issue id required");
  }

  const getIssue = await getIssueDetails(issueId); // get issue from db

  const { reporter_id, created_at, updated_at, ...restItems } = getIssue; //extract information

  if (!reporter_id) {
    throw new Error("Reporter ID is missing");
  }

  const getReporterDetails = await getUserDetails(reporter_id); //get reporter details (id,name,role)

  return {
    ...restItems,
    reporter: getReporterDetails,
    created_at,
    updated_at,
  };
};

// Maintainer (any issue) OR Contributor (own issue, only if status is open)

// {
//   "title": "Updated: Database pool exhaustion fix needed",
//   "description": "Updated description with reproduction steps...",
//   "type": "bug"
// }

export const updateIssueIntoDb = async (
  issueId: number,
  userDetails: IUserTokenPayload,
  payload: TIssueUpdatePayload,
) => {
  const { title, description, type } = payload;

  if (!title || !description || !type) {
    throw new Error(
      "Missing required fields: title , description ,type are required",
    );
  }

  const { id: userId, role: userRole } = userDetails; //rename id and role

  const issueDetails = await getIssueDetails(issueId);

  const isMaintainer = userRole === "maintainer";

  const isContributorAndOwnIssue =
    userRole === "contributor" &&
    userId === issueDetails.reporter_id &&
    issueDetails.status === "open";

  if (isMaintainer || isContributorAndOwnIssue) {
    // {
    //   "title": "Updated: Database pool exhaustion fix needed",
    //   "description": "Updated description with reproduction steps...",
    //   "type": "bug"
    // }
    const updateIssue = await pool.query(
      `
      UPDATE issues
      SET title = $1 ,description =$2 ,type =$3 ,updated_at = NOW()
      WHERE id = $4
      `,
      [title, description, type, issueId],
    );
    console.log("update issue details", updateIssue);
  }

  //   throw new Error("Contributor can not update others issue details");
  // }
};
