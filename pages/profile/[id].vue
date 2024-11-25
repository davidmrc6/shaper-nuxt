<script setup>
/**
 * Defines a dynamic route for profile page of users.
 */
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

/**
 * Set default layout to page.
 */
definePageMeta({
  layout: 'default',
})

const route = useRoute()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const shapes = ref([])

const profileData = ref({
  username: '',
})
const isUserSettingsOpen = ref(false)

/**
 * Checks if current user is profile owner.
 */
const isOwner = computed(() => {
  return user.value?.id === parseInt(route.params.id)
})

/**
 * Check if we can show user settings
 */
const showUserSettings = computed(() => {
  return isAuthenticated.value
})

/**
 * Add a new shape.
 * Whenever a new shape is added by the user, it gets sent to the database and gets
 * appended to the `shapes` array.
 */
const addShape = async () => {
  try {
    const response = await $fetch(`/api/shapes/${route.params.id}`, {
      method: 'POST',
      body: {
        x: 0,
        y: 0,
        color: 'bg-blue-500',
        size: 48,
      },
    })
    shapes.value.push(response.shape)
  }
  catch (error) {
    console.error('Failed to add shape:', error)
  }
}

/**
 * Delets a shape.
 * When the user deletes a shape, its entry gets deleted from the database.
 * @param shapeId - The id of the shape to be deleted.
 */
const deleteShape = async (shapeId) => {
  try {
    await $fetch(`/api/shapes/${route.params.id}`, {
      method: 'DELETE',
      body: { shapeId },
    })
    shapes.value = shapes.value.filter(shape => shape.id !== shapeId)
  }
  catch (error) {
    console.error('Failed to delete shape:', error)
  }
}

/**
 * Fetch profile data.
 */
const fetchProfile = async () => {
  try {
    const response = await $fetch(`/api/profile/${route.params.id}`)
    if (response.status === 200) {
      profileData.value = response.body.profile
    }
    if (response.status === 404) {
      await navigateTo(`/profile/${user.value.id}`)
    }
  }
  catch (error) {
    error.value = 'Failed to load profile'
  }
}

/**
 * Fetch profile shapes data.
 */
const fetchShapes = async () => {
  try {
    const response = await $fetch(`/api/shapes/${route.params.id}`)
    shapes.value = response.shapes
  }
  catch (error) {
    console.error('Failed to fetch shapes:', error)
  }
}

/**
 * Handle user settings menu.
 */
const handleUserSettings = () => {
  isUserSettingsOpen.value = !isUserSettingsOpen.value
}

/**
 * Handle user logout.
 */
const handleLogout = async () => {
  const success = await authStore.logout()
  if (success) {
    isUserSettingsOpen.value = false
    await navigateTo('/login')
  }
}

/**
 * Route user to login screen when they click on the `login` option of the user settings menu.
 */
const handleLoginSubmit = () => {
  navigateTo('/login')
}

/**
 * Route user to profile screen when they click on the `profile` option of the user settings menu.
 */
const handleProfileSubmit = () => {
  navigateTo(`/profile/${user.value.id}`)
}

/**
 * Initialize authentication and fetch data on page load.
 */
onMounted(async () => {
  await authStore.initialize()
  await fetchProfile()
  await fetchShapes()
})
</script>

<template>
  <div class="flex min-h-screen bg-neutral-900 relative">
    <!--
      Apply gradient effect to give page canvas a modern look.
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
    <div class="absolute top-1/2 -translate-y-1/2 flex flex-col gap-4 ml-6">
      <!--
        Button that lets user add shapes to the canvas, if authorized.
      -->
      <button
        v-if="isOwner"
        class="text-5xl text-gray-400 hover:text-white transition-all duration-200"
        @click="addShape"
      >
        <Icon name="mdi-light:plus-circle" />
      </button>
      <!--
        Button that lets user open his profile settings, if logged in. If not logged in,
        the button opens a menu giving the user the option to log in.
      -->
      <button
        class="text-5xl hover:text-white transition-all duration-200"
        :class="isUserSettingsOpen ? 'text-white' : 'text-gray-400'"
        @click="handleUserSettings"
      >
        <Icon name="mdi-light:account" />
      </button>

      <!-- Transition effect when the user opens the user settings menu. -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <!-- User settings menu. -->
        <UserSettings
          v-if="isUserSettingsOpen"
          :handle-logout="handleLogout"
          :handle-login-submit="handleLoginSubmit"
          :handle-profile-submit="handleProfileSubmit"
          :current-user="user"
          :show-user-settings="showUserSettings"
          class="absolute top-0 left-full ml-4 w-48"
        />
      </Transition>
    </div>
  </div>
</template>
