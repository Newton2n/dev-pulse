import { pool } from "../db";
import type { IIssueAndReporter } from "../modules/issues/issues-interface";

const getIssueDetails = async (
  issueId: number,
): Promise<Omit<IIssueAndReporter, "reporter">> => {
  try {
    if (!issueId) {
      throw new Error("Missing required field: issueId");
    }

    const getDetails = await pool.query(
      `
        SELECT * FROM issues
        WHERE id = $1
        `,
      [issueId],
    );
    if (getDetails.rows.length === 0) {
      throw new Error(`Issue with ID ${issueId} not found`);
    }

    return getDetails.rows[0];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error ;
    throw new Error(errorMessage);
  }
};

export default getIssueDetails;
