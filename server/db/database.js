import pg from "pg"
import * as dotenv from "dotenv"

dotenv.config()
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const testConnection = async () => {
  try {
    const client = await pool.connect()
    await client.query('SELECT NOW()')
    client.release()
    console.log("Database connected successfully!")
  } catch (err) {
    console.error("Database connection error:", err.stack)
    throw err
  }
}

// Init tables
const initializeTables = async () => {
  const client = await pool.connect()
  try {
    // Start transaction
    await client.query('BEGIN')

    // Create users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      bio TEXT,
      display_name VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `

    // Create shapes table
    const createShapesTable = `
      CREATE TABLE IF NOT EXISTS shapes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        x INTEGER NOT NULL,
        y INTEGER NOT NULL,
        color VARCHAR(50) DEFAULT 'bg-blue-500',
        size INTEGER DEFAULT 48,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    await client.query(createTableQuery)
    await client.query(createShapesTable)
    await client.query('COMMIT')
    console.log("Database tables initialized successfully!")
  } catch (error) {
    await client.query('ROLLBACK')
    console.error("Error initializing database tables:", error.stack)
    throw error
  } finally {
    client.release()
  }
}

export const ensureDatabase = async () => {
  await testConnection()
  await initializeTables()
}

const query = (text, params) => pool.query(text, params)

export { pool, query }
