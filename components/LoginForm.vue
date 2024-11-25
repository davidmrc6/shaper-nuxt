<script setup>
/**
 * Defines the login form component.
 */
const props = defineProps({
  /**
   * Function defining the action when the login form is submitted.
   */
  onSubmit: {
    type: Function,
    required: true,
  },
  /**
   * Loading state of authentication.
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * Error during the authentication.
   */
  error: {
    type: String,
    default: '',
  },
})

const form = ref({
  username: '',
  password: '',
})

/**
 * Handles the submit action.
 */
const handleSubmit = () => {
  props.onSubmit(form.value)
}
</script>

<template>
  <div>
    <!--
      Div containing any potential error message when trying to log in.
    -->
    <div class="text-2xl flex py-6 flex-col font-parkinsans w-6/12 mx-auto">
      <div
        v-if="error"
        class="flex flex-col text-red-500 text-base mb-4 text-center"
      >
        {{ error.toLowerCase() }}
      </div>
      <!-- Username input box -->
      <input
        v-model="form.username"
        type="text"
        class="pl-1.5 border-b-2 border-gray-500 bg-transparent px-6 py-2 font-bold transition-all duration-200 text-white focus:outline-none focus:border-white"
        placeholder="username"
        name="uname"
        required
      >
      <!-- Password input box -->
      <input
        v-model="form.password"
        type="password"
        class="pl-1.5 border-b-2 border-gray-500 bg-transparent px-6 py-2 font-bold transition-all duration-200 text-white focus:outline-none focus:border-white"
        placeholder="password"
        name="psw"
        required
      >
      <!-- Login button -->
      <button
        class="bg-transparent block h-max w-max border-none mx-auto py-3"
        :disabled="loading"
        @click.prevent="handleSubmit"
      >
        <span class="text-gray-400 hover:text-white font-bold transition-all duration-200">
          {{ loading ? 'logging in...' : 'login' }}
        </span>
      </button>

      <!-- Option for user to sign up if they don't have an account -->
      <div class="text-sm text-gray-400 text-center mt-4">
        new around here?
        <NuxtLink to="/register">
          <span class="text-gray-400 hover:text-white font-bold transition-all duration-200">sign up</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
