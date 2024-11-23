export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
    loading: false,
    initialized: false
  }),

  actions: {
    clearError() {
      this.error = null
    },

    async checkAuth() {
      try {
        const response = await $fetch('/api/auth/me')
        if (response.status === 200) {
          this.user = response.body.user
          return true
        }
        return false
      } catch (error) {
        console.error('Auth check error:', error)
        return false
      }
    },

    async register(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: credentials
        })

        if (response.status === 201) {
          await this.login({
            username: credentials.username,
            password: credentials.password
          })
          return true
        } else {
          this.error = response.body.message
          return false
        }
      } catch (error) {
        console.error('Registration error:', error)
        this.error = error.data?.body?.message || 'Registration failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null

      try {
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

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
        this.user = null
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
})
