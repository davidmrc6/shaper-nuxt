<script setup>
/**
 * Defines the user settings that get mounted when the user clicks on
 * the profile icon.
 */
defineProps({
  /**
   * Handles user logout.
   */
  handleLogout: Function,
  /**
   * Handles user login.
   */
  handleLoginSubmit: Function,
  /**
   * Handles user clicking on the `profile` option.
   */
  handleProfileSubmit: Function,
  /**
   * Display name of current user.
   */
  currentUser: Object,
  /**
   * Checks if user settings should be displayed.
   */
  showUserSettings: Boolean,
})
</script>

<template>
  <div class="bg-neutral-900 p-4 rounded-lg shadow-lg">
    <div v-if="showUserSettings">
      <h1 class="text-3xl text-white font-bold">
        {{ currentUser?.username }}
      </h1>
      <!-- Add a container for buttons -->
      <div class="flex flex-col">
        <button
          class="text-3xl mt-1 text-gray-400 hover:text-white transition-all duration-200"
          @click="handleProfileSubmit"
        >
          profile
        </button>
        <button
          class="text-3xl text-gray-400 hover:text-white transition-all duration-200"
          @click="handleLogout"
        >
          logout
        </button>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-col">
        <button
          class="text-3xl text-gray-400 hover:text-white transition-all duration-200"
          @click="handleLoginSubmit"
        >
          login
        </button>
      </div>
    </div>
  </div>
</template>
