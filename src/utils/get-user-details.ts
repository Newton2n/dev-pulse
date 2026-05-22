import { pool } from "../db";

const getUserDetails = async (userId: number) => {
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
    throw new Error("Something went wrong to get user details");
  }
};

export default getUserDetails;
