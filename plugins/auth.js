export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  // Check auth status when app loads
  if (!authStore.user) {
    await authStore.checkAuth()
  }
})
