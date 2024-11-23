import { ensureDatabase } from '../db/database'

export default defineEventHandler(async (event) => {
  try {
    await ensureDatabase()
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
})
