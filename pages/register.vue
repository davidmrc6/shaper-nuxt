<script setup>
/**
 * Register page of the website.
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
const { error, loading } = storeToRefs(authStore)

/**
 * Handles user registration.
 * The registration logic is handled by the `register` method of the `useAuthStore` store.
 * If the registration is successful, the user gets redirected straight to his new profile page.
 * @param credentials - Username, email and password of new user.
 */
const handleRegister = async (credentials) => {
  const success = await authStore.register(credentials)
  if (success) {
    await navigateTo(`/profile/${authStore.user.id}`)
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-neutral-900">
    <div class="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 class="text-5xl text-center text-white font-bold font-parkinsans">
        shaper
      </h1>
      <!-- User registration form -->
      <RegistrationForm
        :on-submit="handleRegister"
        :loading="loading"
        :error="error"
      />
    </div>
  </div>
</template>
