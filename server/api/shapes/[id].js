import { query } from '~/server/db/database'

/**
 * Defines methods for fetching and updating shapes.
 */
export default defineEventHandler(async (event) => {
  const method = event.method
  const userId = event.context.params?.id

  // Fetch shapes for user.
  if (method === 'GET') {
    try {
      const result = await query(
        'SELECT * FROM shapes WHERE user_id = $1 ORDER BY created_at ASC',
        [userId],
      )
      return { shapes: result.rows }
    }
    catch (error) {
      console.error('Error fetching shapes:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch shapes',
      })
    }
  }

  // Create new shape.
  if (method === 'POST') {
    const body = await readBody(event)
    try {
      const result = await query(
        'INSERT INTO shapes (user_id, x, y, color, size) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, body.x, body.y, body.color, body.size],
      )
      return { shape: result.rows[0] }
    }
    catch (error) {
      console.error('Error creating shape:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to create shape',
      })
    }
  }

  // Update shape.
  if (method === 'PUT') {
    const body = await readBody(event)
    try {
      const result = await query(
        'UPDATE shapes SET x = $1, y = $2, color = $3, size = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND user_id = $6 RETURNING *',
        [body.x, body.y, body.color, body.size, body.shapeId, userId],
      )
      return { shape: result.rows[0] }
    }
    catch (error) {
      console.error('Error updating shape:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to update shape',
      })
    }
  }

  // Delete shape.
  if (method === 'DELETE') {
    const body = await readBody(event)
    try {
      await query(
        'DELETE FROM shapes WHERE id = $1 AND user_id = $2',
        [body.shapeId, userId],
      )
      return { success: true }
    }
    catch (error) {
      console.error('Error deleting shape:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to delete shape',
      })
    }
  }
})
