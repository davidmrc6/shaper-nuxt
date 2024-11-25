/**
 * Authentication store using Pinia for managing authentication states and operations.
 * Handles user registration, login, logout, and authentication status checking.
 */
export const useAuthStore = defineStore('auth', {
  /**
   * Initial state of the authentication store.
   * @returns - The initial state object.
   */
  state: () => ({
    user: null,
    error: null,
    loading: false,
    initialized: false,
  }),

  /**
   * Computed properties for the `auth` store.
   */
  getters: {
    /**
     * Checks if a user is currently authenticated.
     * @param {Object} state - Current state of the store.
     * @returns {boolean} True if the user is authenticated, false otherwise.
     */
    isAuthenticated: state => !!state.user && state.initialized,
  },

  actions: {
    /**
     * Clears the current error state.
     */
    clearError() {
      this.error = null
    },

    /**
     * Initializes the authentication state if not already initialized.
     */
    async initialize() {
      if (!this.initialized) {
        await this.checkAuth()
        this.initialized = true
      }
    },

    /**
     * Checks current authentication status.
     * @returns {Promise<boolean>} - True if the user is authenticated, false otherwise.
     */
    async checkAuth() {
      try {
        const response = await $fetch('/api/auth/me')
        if (response.status === 200) {
          this.user = response.body.user
          return true
        }
        this.user = null
        return false
      }
      catch (error) {
        console.error('Auth check error:', error)
        this.user = null
        return false
      }
    },

    /**
     * Registers a new user account.
     * @param {Object} credentials - User registration credentials.
     * @param {string} credentials.username - Username for new account.
     * @param {string} credentials.password - Password for new account.
     * @returns {Promise<boolean>} - True if registration was successful, false otherwise.
     */
    async register(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: credentials,
        })

        if (response.status === 201) {
          await this.login({
            username: credentials.username,
            password: credentials.password,
          })
          return true
        }
        else {
          this.error = response.body.message
          return false
        }
      }
      catch (error) {
        console.error('Registration error:', error)
        this.error = error.data?.body?.message || 'Registration failed'
        return false
      }
      finally {
        this.loading = false
      }
    },

    /**
     * Authenticates a user with their credentials.
     * @param {Object} credentials - User login credentials.
     * @param {string} credentials.username - Username for the account.
     * @param {string} credentials.password - Password for the account.
     * @returns {Promise<boolean>} - True if login was successful, false otherwise.
     */
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
          body: credentials,
        })

        if (response.status === 200) {
          this.user = response.body.user
          this.initialized = true
          return true
        }
        else {
          this.error = response.body.message
          return false
        }
      }
      catch (error) {
        this.error = error.data?.body?.message || 'Login failed'
        return false
      }
      finally {
        this.loading = false
      }
    },

    /**
     * Logs current user out.
     * @returns {Promise<boolean>} - True if logout was successful, false otherwise.
     */
    async logout() {
      try {
        const response = await $fetch('/api/auth/logout', { method: 'POST' })
        if (response.status === 200) {
          this.user = null
          this.initialized = false
          return true
        }
        return false
      }
      catch (error) {
        console.error('Logout error:', error)
        return false
      }
    },
  },
})
