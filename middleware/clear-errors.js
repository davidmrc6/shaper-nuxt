import { useAuthStore } from '~/stores/useAuthStore'

/**
 * Middleware that clears login and register errors.
 */
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.clearError()
})
