import { useAuthStore } from '~/stores/auth'

/**
 * Middleware that clears login and register errors.
 */
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.clearError()
})
