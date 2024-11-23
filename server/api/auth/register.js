import { query } from "~/server/db/database";
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, username, password } = body

    // Validate inputs
    if (!email || !username || !password) {
      return {
        status: 400,
        body: { message: 'All fields are required' }
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        status: 400,
        body: { message: 'Invalid email format' }
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if email exists in db
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    if (existingUser.rows.length > 0) {
      return {
        status: 409,
        body: { message: 'Email already registered' }
      }
    }

    // Insert new user
    const result = await query(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username',
      [email, username, hashedPassword]
    )

    return {
      status: 201,
      body: {
        message: 'Registration succesful',
        user: result.rows[0]
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      status: 500,
      body: { message: 'Internal server error' }
    }
  }
})
