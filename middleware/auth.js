// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // If no user in store, try to check auth status
  if (!authStore.user) {
    await authStore.checkAuth()
  }

  // If still no user after checking, redirect to login
  if (!authStore.user) {
    return navigateTo('/login')
  }
})
