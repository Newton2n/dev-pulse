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
import type { Request } from "express";

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
export const getAllIssueFromDb = async (
  req: Request,
): Promise<IIssueAndReporter[]> => {
  const { sort, type, status } = req.query;

  const queryValues: string[] = [];
  const whereClauses: string[] = [];


  let dbQuery = "SELECT * FROM issues"; //base db query

  if (type) {
    queryValues.push(type as string);
    whereClauses.push(`type =$${queryValues.length}`);
  } // push query and clauses

  if (status) {
    queryValues.push(status as string);
    whereClauses.push(`status =$${queryValues.length}`);
  } // push query and clauses


  if (whereClauses.length > 0) {
    dbQuery += " WHERE " + whereClauses.join(" AND ");
  } // check status and join clauses

  dbQuery += ` ORDER BY id ${sort ==='oldest' ? 'ASC':'DESC'}`; // sort the result default newest 

  const getIssueResponse = await pool.query(
    `${dbQuery}`,
    queryValues,
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

export const updateIssueIntoDb = async (
  issueId: number,
  userDetails: IUserTokenPayload,
  payload: TIssueUpdatePayload,
): Promise<Omit<IIssueAndReporter, "reporter">> => {
  const { title, description, type, status } = payload;

  const updateIssueStatus = status ? status : "open";

  if (!title || !description || !type) {
    throw new Error(
      "Missing required fields: title , description ,type are required",
    );
  }

  const { id: userId, role: userRole } = userDetails; //rename id and role

  const issueDetails = await getIssueDetails(issueId); //get issue details

  const isMaintainer = userRole === "maintainer"; // check is maintainer

  // A contributor can only update their own issue if it is still open.
  const isContributorAndOwnIssue =
    userRole === "contributor" &&
    userId === issueDetails.reporter_id &&
    issueDetails.status === "open";

  // get access to update issue is user is maintainer or contributor(own issue, only if status is open)
  if (isMaintainer || isContributorAndOwnIssue) {
    //db query
    const updateIssue = await pool.query(
      `
      UPDATE issues
      SET title = $1 ,description =$2 ,type =$3 ,status =$4 ,updated_at = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [title, description, type, updateIssueStatus, issueId],
    );

    //throw error if update issue don not resolve
    if (updateIssue.rows.length === 0) {
      throw new Error(
        "Issue not found or you do not have permission to edit it",
      );
    }

    return updateIssue.rows[0];
  } else {
    throw new Error(
      "Contributor cannot update issues owned by others or issues that are not open",
    );
  }
};

//delete issue

export const deleteIssueFromDb = async (issueId: number) => {
  if (!issueId) {
    throw new Error("Issue id is missing ");
  }

  //db query for deleting issue
  const deleteIssue = await pool.query(
    `
    DELETE FROM issues
    WHERE id =$1
    
    `,
    [issueId],
  );

  if (deleteIssue.rowCount === 0) {
    throw new Error("Issue not found");
  }
};
