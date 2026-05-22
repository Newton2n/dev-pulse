import { pool } from "../db";
import type { IReporter } from "../modules/issues/issues-interface";

const getUserDetails = async (userId: number): Promise<IReporter> => {
  try {
    if (!userId) {
      throw new Error("Missing required field: userId");
    }

    const getDetails = await pool.query(
      `
        SELECT id,name,role FROM users
        WHERE id = $1
        `,
      [userId],
    );
    if (getDetails.rows.length === 0) {
      throw new Error("Invalid id");
    }

    return getDetails.rows[0];
  } catch (error) {
      const errorMessage =
      error instanceof Error ? error.message : "An error occurred"; // check the error object is js standard error ;
    throw new Error(errorMessage);
  }
};

export default getUserDetails;
