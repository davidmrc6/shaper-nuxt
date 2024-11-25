import { ensureDatabase } from '../db/database'

/**
 * Middleware to ensure the database is connected and tables are initialized.
 *
 * NOTE: This middleware is currently used on all page reloads, which is not ideal.
 * This is because I had some initial issues with the database connection, which could
 * be fixed by refreshing the page. This is a temporary solution. Since the application
 * and, therefore, the database is small in scale, this is not a huge issue right now,
 * but if this application gets developed further, it is something I will take into consideration
 * and try to fix.
 */
export default defineEventHandler(async () => {
  try {
    await ensureDatabase()
  }
  catch (error) {
    console.error('Failed to initialize database:', error)
  }
})
