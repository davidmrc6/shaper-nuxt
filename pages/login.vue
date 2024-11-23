<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from "~/stores/auth";

import LoginForm from "~/components/LoginForm.vue";

const router = useRouter()
const authStore = useAuthStore()
const { error, loading } = storeToRefs(authStore)

const handleLogin = async (credentials) => {
  const success = await authStore.login(credentials)
  if (success) {
    router.push('/')
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-neutral-900">
    <div class="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 class="text-5xl text-center text-white font-bold font-parkinsans">
        shaper
      </h1>

      <LoginForm
      :loading="loading"
      :error="error"
      :on-submit="handleLogin" />
    </div>
  </div>
</template>
