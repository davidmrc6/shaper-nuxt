export const useProfileData = () => {
  const route = useRoute()
  const error = ref('')
  const profileData = ref({
    username: '',
  })

  const fetchProfile = async (userId) => {
    try {
      const response = await $fetch(`/api/profile/${route.params.id}`)
      if (response.status === 200) {
        profileData.value = response.body.profile
      }
      if (response.status === 404) {
        await navigateTo(`/profile/${userId}`)
      }
    }
    catch (error) {
      error.value = 'Failed to load profile'
    }

    return { profileData, error }
  }

  return {
    fetchProfile,
    profileData,
    error,
  }
}
