<script setup>
const props = defineProps({
  handleLogout: Function,
  handleLoginSubmit: Function,
  handleProfileSubmit: Function,
  currentUser: Object,
  showUserSettings: Boolean,
})
</script>

<template>
  <div class="bg-neutral-900 p-4 rounded-lg shadow-lg">
    <div v-if="showUserSettings">
      <h1 class="text-3xl text-white font-bold">
        {{ currentUser?.username }}
      </h1>
      <button
        @click="handleProfileSubmit"
        class="text-3xl text-gray-400 hover:text-white transition-all duration-200"
      >
        profile
      </button>
      <button
        @click="handleLogout"
        class="text-3xl text-gray-400 hover:text-white transition-all duration-200"
      >
        logout
      </button>
    </div>
    <div v-else>
      <button
        @click="handleLoginSubmit"
        class="text-3xl text-gray-400 hover:text-white transition-all duration-200"
      >
        log in
      </button>
    </div>
  </div>
</template>
