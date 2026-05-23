import { Pool } from "pg";
import config from "../config/dotenv";

//database connection pool
export const pool = new Pool({
  connectionString: config.connectionString,
});

//database query for creating users table
export const dbInit = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )`);

    //database query for creating issues table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS issues(
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT CHECK (LENGTH(description) >= 20),
        type VARCHAR(20) CHECK(type IN ('bug','feature_request')),
        status VARCHAR(20) DEFAULT 'open' CHECK(status IN ('open','in_progress','resolved')),
        reporter_id INT NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )`);
  } catch (error) {
    throw error;
  }
};
