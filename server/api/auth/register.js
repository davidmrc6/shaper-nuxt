import bcrypt from 'bcrypt'
import { query } from '~/server/db/database'

/**
 * Defines the registration event handler.
 * @param event - An event object containing the request body.
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, username, password } = body

    // Validate inputs.
    if (!email || !username || !password) {
      return {
        status: 400,
        body: { message: 'All fields are required' },
      }
    }

    // Validate email format using a regular expression.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        status: 400,
        body: { message: 'Invalid email format' },
      }
    }

    // Hash password with `bcrypt`.
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if email exists in database.
    // If it does, throw an error message.
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    )
    if (existingUser.rows.length > 0) {
      return {
        status: 409,
        body: { message: 'Email already registered' },
      }
    }

    // Insert new user into database.
    const result = await query(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username',
      [email, username, hashedPassword],
    )

    // On succesfull authentication, return success message and new user data,
    return {
      status: 201,
      body: {
        message: 'Registration succesful',
        user: result.rows[0],
      },
    }
  }
  catch (error) {
    console.error('Registration error:', error)
    return {
      status: 500,
      body: { message: 'Internal server error' },
    }
  }
})
