/**
 * Defines the logout event handler.
 * @param evenet - An event object containing the request body.
 */
export default defineEventHandler(async (event) => {
  // Delete the `auth_token` cookie.
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  // On successful logout, return success message.
  return {
    status: 200,
    body: { message: 'Logged out successfully' },
  }
})
