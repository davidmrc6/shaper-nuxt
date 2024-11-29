<script setup>
/**
 * Defines a dynamic route for profile page of users.
 */
import { storeToRefs } from 'pinia'

/**
 * Set default layout to page.
 */
definePageMeta({
  layout: 'default',
})

const route = useRoute()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const {
  fetchProfile,
  profileData,
} = useProfileData()
const {
  shapes,
  fetchShapes,
  deleteShape,
} = useShapes()

/**
 * Checks if current user is profile owner.
 */
const isOwner = computed(() => {
  return user.value?.id === parseInt(route.params.id)
})

/**
 * Initialize authentication and fetch data on page load.
 */
onMounted(async () => {
  await authStore.initialize()
  await fetchProfile(route.params.id)

  await fetchShapes()
})
</script>

<template>
  <div class="flex min-h-screen bg-neutral-900 relative">
    <!--
      Gradient effect.
    -->
    <div class="relative flex mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 font-parkinsans">
      <!-- Left gradient. -->
      <div class="absolute left-0 top-0 w-0.5 h-full">
        <div class="absolute inset-0 bg-gray-500" />
        <div class="absolute inset-0 bg-gradient-to-b from-neutral-900 via-transparent via-50% to-neutral-900" />
      </div>
      <!-- Right gradient. -->
      <div class="absolute right-0 top-0 w-0.5 h-full">
        <div class="absolute inset-0 bg-gray-500" />
        <div class="absolute inset-0 bg-gradient-to-b from-neutral-900 via-transparent via-50% to-neutral-900" />
      </div>

      <!-- Content. -->
      <ShapeCanvas
        :profile="profileData"
        :shapes="shapes"
        :is-owner="isOwner"
        @delete-shape="deleteShape"
      />
    </div>
  </div>
</template>
