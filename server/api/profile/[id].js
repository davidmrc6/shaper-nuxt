import jwt from 'jsonwebtoken'
import { query } from '~/server/db/database'

/**
 * Defines methods for fetching and updating user profiles.
 */
export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const method = event.method

  // GET profile.
  // Get the user profile by ID.
  // NOTE: This method also extracts user bio and display_name, even though
  // they are currently not used in the application itself.
  if (method === 'GET') {
    try {
      const result = await query(
        'SELECT id, email, username, bio, display_name as "displayName" FROM users WHERE id = $1',
        [id],
      )

      if (result.rows.length === 0) {
        return {
          status: 404,
          body: { message: 'Profile not found' },
        }
      }

      return {
        status: 200,
        body: { profile: result.rows[0] },
      }
    }
    catch (error) {
      console.error('Error fetching profile:', error)
      return {
        status: 500,
        body: { message: 'Internal server error' },
      }
    }
  }

  // PUT (update) profile.
  // Updates user profile. Requires user to be authenticated.
  // NOTE: This method was created to test the PUT method in the API, and is
  // currently not used in the web application.
  if (method === 'PUT') {
    try {
      // Verify user is authorized
      const authToken = getCookie(event, 'auth_token')
      if (!authToken) {
        return {
          status: 401,
          body: { message: 'Unauthorized' },
        }
      }

      const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'default-secret')
      if (decoded.userId !== parseInt(id)) {
        return {
          status: 403,
          body: { message: 'Forbidden' },
        }
      }

      const body = await readBody(event)
      const { displayName, bio } = body

      const result = await query(
        'UPDATE users SET display_name = $1, bio = $2 WHERE id = $3 RETURNING id, email, username, bio, display_name',
        [displayName, bio, id],
      )

      return {
        status: 200,
        body: { profile: result.rows[0] },
      }
    }
    catch (error) {
      console.error('Error updating profile:', error)
      return {
        status: 500,
        body: { message: 'Internal server error' },
      }
    }
  }
})
