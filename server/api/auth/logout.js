export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  return {
    status: 200,
    body: { message: 'Logged out successfully' },
  }
})
