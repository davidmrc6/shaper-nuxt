<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

// Handle authentication and navigation
onMounted(async () => {
  // Wait for auth check to complete
  await authStore.initialize()

  console.log('Auth state:', {
    user: user.value,
    isAuthenticated: isAuthenticated.value
  })

  // Now we can safely check auth state and navigate
  if (!isAuthenticated.value) {
    await navigateTo('/login')
  } else if (user.value?.id) {
    await navigateTo(`/profile/${user.value.id}`)
  }
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-neutral-900">
    <div class="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 class="text-5xl text-center text-white font-bold font-parkinsans">
        shaper
      </h1>
    </div>
  </div>
</template>
