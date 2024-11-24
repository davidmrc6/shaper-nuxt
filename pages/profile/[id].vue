<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const shapes = ref([])

definePageMeta({
  layout: 'default'
})

const profileData = ref({
  username: '',
  bio: '',
  displayName: ''
})
const isEditing = ref(false)
const error = ref(null)
const isUserSettingsOpen = ref(false)

// Check if current user is profile owner
const isOwner = computed(() => {
  return user.value?.id === parseInt(route.params.id)
})

// Check if we can show user settings
const showUserSettings = computed(() => {
  return isAuthenticated.value
})

// Add a new shape
const addShape = () => {
  shapes.value.push({
    id: Date.now(), // For now, timestamp is used as id
    x: 0,
    y: 0
  })
}

// Delete a shape
const deleteShape = (shapeId) => {
  shapes.value = shapes.value.filter(shape => shape.id !== shapeId)
}

// Fetch profile data
const fetchProfile = async () => {
  try {
    const response = await $fetch(`/api/profile/${route.params.id}`)
    if (response.status === 200) {
      profileData.value = response.body.profile
    }
    if (response.status === 404) {
      router.push(`/profile/${user.value.id}`)
    }
  } catch (error) {
    error.value = 'Failed to load profile'
  }
}

const handleUserSettings = () => {
  isUserSettingsOpen.value = !isUserSettingsOpen.value
}

const handleLogout = async () => {
  const success = await authStore.logout()
  if (success) {
    isUserSettingsOpen.value = false
    router.push('/login')
  }
}

const handleLoginSubmit = () => {
  router.push('/login')
}

const handleProfileSubmit = () => {
  router.push(`/profile/${user.value.id}`)
}

// Initialize auth on page load
onMounted(async () => {
  await authStore.initialize()
  fetchProfile()
})
</script>

<template>
  <div class="flex min-h-screen bg-neutral-900 relative">
    <div class="relative flex mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 font-parkinsans">

      <!-- Left gradient -->
      <div class="absolute left-0 top-0 w-0.5 h-full">
        <div class="absolute inset-0 bg-gray-500" />
        <div class="absolute inset-0 bg-gradient-to-b from-neutral-900 via-transparent via-50% to-neutral-900" />
      </div>
      <!-- Right gradient -->
      <div class="absolute right-0 top-0 w-0.5 h-full">
        <div class="absolute inset-0 bg-gray-500" />
        <div class="absolute inset-0 bg-gradient-to-b from-neutral-900 via-transparent via-50% to-neutral-900" />
      </div>

      <!-- Content -->
      <Canvas
        :profile="profileData"
        :shapes="shapes"
        @delete-shape="deleteShape"
      />

    </div>
    <div class="absolute top-1/2 -translate-y-1/2 flex flex-col gap-4 ml-6">
      <button
      v-if="isOwner"
      @click="addShape"
        class="text-5xl text-gray-400 hover:text-white transition-all duration-200"
      >
        <Icon name="mdi-light:plus-circle" />
      </button>

      <button
        @click="handleUserSettings"
        class="text-5xl hover:text-white transition-all duration-200"
        :class="isUserSettingsOpen ? 'text-white' : 'text-gray-400'"
      >
        <Icon name="mdi-light:account" />
      </button>

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
          :currentUser="user"
          :show-user-settings="showUserSettings"
          class="absolute top-0 left-full ml-4 w-48"
        />
      </Transition>
    </div>
  </div>
</template>
