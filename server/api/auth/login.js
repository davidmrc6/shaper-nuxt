import { query } from "~/server/db/database"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

  // Validate inputs
    if (!username || !password) {
      return {
        status: 400,
        body: { message: 'Username and password are required' }
      }
    }

    // Get user from database
    const result = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    )

    const user = result.rows[0]
    if (!user) {
      return {
        status: 401,
        body: { message: 'Invalid credentials' }
      }
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return {
        status: 401,
        body: { message: 'Invalid credentials' }
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    )

    // Set HTTP-only cookie with token
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/'
    })

    return {
      status: 200,
      body: {
        message: 'Login succesful',
        user: {
          id: user.id,
          email: user.email
        }
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      status: 500,
      body: { message: 'Internal server error' }
    }
  }
})
