import jwt from 'jsonwebtoken'
import { query } from '~/server/db/database'

/**
 * Authentication verification endpoint that checks if a user is currently
 * logged in and returns their basic profile information.
 */
export default defineEventHandler(async (event) => {
  try {
    // Check for auth token in cookies
    const token = getCookie(event, 'auth_token')
    if (!token) {
      return {
        status: 401,
        body: { message: 'Not authenticated' },
      }
    }

    // Verify token authenticity.
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')

    // Retrieve user data.
    const result = await query(
      'SELECT id, email, username FROM users WHERE id = $1',
      [decoded.userId],
    )

    // Verify that user exists in database.
    if (!result.rows[0]) {
      return {
        status: 401,
        body: { message: 'User not found' },
      }
    }

    return {
      status: 200,
      body: { user: result.rows[0] },
    }
  }
  catch (error) {
    console.error('Auth check error', error)
    return {
      status: 401,
      body: { message: 'Authentication failed' },
    }
  }
})
