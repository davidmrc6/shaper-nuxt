<script setup>
/**
 * Login page of the website.
 */
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

/**
 * Set default layout to page, as well as necessary middleware.
 * The 'clear-errors' middleware is added to clear any login/register
 * errors when the page gets refreshed.
 */
definePageMeta({
  middleware: ['clear-errors'],
  layout: 'default',
})

const authStore = useAuthStore()
const { isAuthenticated, error, loading } = storeToRefs(authStore)

/**
 * Handles user login.
 * The login logic is handled by the `login` method of the `useAuthStore` store.
 * If the login is successful, the user gets redirected to his profile page.
 * @param credentials - Username and password of user.
 */
const handleLogin = async (credentials) => {
  const success = await authStore.login(credentials)
  if (success) {
    await navigateTo(`/profile/${authStore.user.id}`)
  }
}

/**
 * If user is already logged in when accessing the login page, redirect to profile page.
 */
onMounted(async () => {
  await authStore.initialize()

  if (isAuthenticated.value) {
    navigateTo(`/profile/${authStore.user.id}`)
  }
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-neutral-900">
    <div class="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 class="text-5xl text-center text-white font-bold font-parkinsans">
        shaper
      </h1>
      <!-- User login form -->
      <LoginForm
        :loading="loading"
        :error="error"
        :on-submit="handleLogin"
      />
    </div>
  </div>
</template>
