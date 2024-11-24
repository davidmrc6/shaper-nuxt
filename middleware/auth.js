export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Wait for auth check to complete
  await authStore.checkAuth()

  console.log('Auth state:', {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    to: to.path
  })

  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // If we're already on the profile page, don't redirect
  if (to.path === `/profile/${authStore.user.id}`) {
    return
  }

  // If authenticated, redirect to profile
  return navigateTo(`/profile/${authStore.user.id}`)
})
