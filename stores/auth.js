import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
    loading: false
  }),

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        // Validate inputs
        if (!credentials.username || !credentials.password) {
          this.error = 'Username and password are required'
          return false
        }

        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        if (response.status === 200) {
          this.user = response.body.user
          return true
        } else {
          this.error = response.body.message
          return false
        }
        
      } catch (error) {
        this.error = error.data?.body?.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
    }
  }
})
