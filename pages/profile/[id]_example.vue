<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const profileData = ref({
  bio: '',
  displayName: ''
})
const isEditing = ref(false)
const error = ref(null)

// Check if current user is profile owner
const isOwner = computed(() => {
  return user.value?.id === parseInt(route.params.id)
})

// Fetch profile data
const fetchProfile = async () => {
  try {
    const response = await $fetch(`/api/profile/${route.params.id}`)
    if (response.status === 200) {
      profileData.value = response.body.profile
    }
  } catch (error) {
    error.value = 'Failed to load profile'
  }
}

// Update profile
const updateProfile = async () => {
  try {
    const response = await $fetch(`/api/profile/${route.params.id}`, {
      method: 'PUT',
      body: profileData.value
    })

    if (response.status === 200) {
      isEditing.value = false
      error.value = null
    }
  } catch (err) {
    error.value = 'Failed to update profile' + err.message
  }
}

const handleLogout =  () => {
  const success = authStore.logout()
  if (success) {
    router.push('/login')
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-neutral-900">
    <div class="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="text-2xl flex py-6 flex-col font-parkinsans w-6/12 mx-auto">
        <button
          @click="handleLogout"
          class="bg-transparent block h-max w-max border-none mx-auto py-3 text-gray-400 hover:text-white transition-all duration-200"
        >
        log out
        </button>
        <div class="max-w-4xl mx-auto bg-neutral-800 rounded-lg p-6">
          <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

          <div v-if="!isEditing">
            <h1 class="text-3xl text-white mb-6">Profile</h1>
            <div class="space-y-4">
              <p class="text-white">Display Name: {{ profileData.displayName }}</p>
              <p class="text-white">Bio: {{ profileData.bio }}</p>

              <button
                v-if="isOwner"
                @click="isEditing = true"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <form v-else @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-white mb-2">Display Name</label>
              <input
                v-model="profileData.displayName"
                type="text"
                class="w-full p-2 rounded bg-neutral-700 text-white"
              />
            </div>

            <div>
              <label class="block text-white mb-2">Bio</label>
              <textarea
                v-model="profileData.bio"
                class="w-full p-2 rounded bg-neutral-700 text-white"
                rows="4"
              />
            </div>

            <div class="flex space-x-4">
              <button
                type="submit"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                type="button"
                @click="isEditing = false"
                class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</div>
</template>
