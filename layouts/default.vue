<script setup>
/**
 * Defines default layout for web pages.
 * Includes a navigation bar, a footer, and transitions between pages.
 */
import { storeToRefs } from 'pinia'

const route = useRoute()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const isUserSettingsOpen = ref(false)

const {
  addShape,
} = useShapes()

/**
 * Transition between pages.
 */
const slideTransition = {
  name: 'page',
  mode: 'out-in',
}

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

const showProfileButtons = computed(() => {
  return !['login', 'register'].includes(route.name)
})

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
</script>

<template>
  <div class="flex flex-col min-h-screen bg-neutral-900 text-white font-parkinsans">
    <!-- Navigation container -->
    <nav class="fixed top-0 left-0 right-0 z-40">
      <div class="bg-neutral-900 border-b border-neutral-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo of web application -->
            <h1 class="text-2xl font-bold">
              shaper
            </h1>

            <!-- Profile buttons container -->
            <div
              v-if="showProfileButtons"
              class="relative"
            >
              <!-- Button to add shapes -->
              <button
                v-if="isOwner"
                class="text-4xl text-gray-400 hover:text-white transition-all duration-200"
                @click="addShape"
              >
                <Icon name="mdi-light:plus-circle" />
              </button>

              <!-- Profile button -->
              <button
                class="text-4xl px-2 text-gray-400 hover:text-white transition-all duration-200"
                :class="isUserSettingsOpen ? 'text-white' : 'text-gray-400'"
                @click="handleUserSettings"
              >
                <Icon name="mdi-light:account" />
              </button>

              <!-- User Settings Component -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <UserSettings
                  v-if="isUserSettingsOpen"
                  :handle-logout="handleLogout"
                  :handle-login-submit="handleLoginSubmit"
                  :handle-profile-submit="handleProfileSubmit"
                  :current-user="user"
                  :show-user-settings="isAuthenticated"
                  class="absolute top-full right-0 mt-2 z-50"
                />
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-grow pt-16">
      <NuxtPage :transition="slideTransition" />
    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-800 bg-neutral-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-center text-neutral-500">
          created by David Mereacre.
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 300ms ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
  will-change: transform, opacity;
}

/* Base styles */
:root {
  background-color: #171717;
  min-height: 100vh;
}
</style>
