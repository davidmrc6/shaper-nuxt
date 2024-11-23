export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // If trying to access someone else's profile
  if (to.params.id && authStore.user?.id !== parseInt(to.params.id)) {
    return {
      path: `/profile/${to.params.id}`,
      query: { readonly: 'true' }
    }
  }

})
