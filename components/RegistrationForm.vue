<script setup>
const props = defineProps({
  onSubmit: {
    type: Function,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const form = ref({
  email: '',
  username: '',
  password: '',
})

const handleSubmit = () => {
  props.onSubmit(form.value)
}
</script>

<template>
  <div>
    <div class="text-2xl flex py-6 flex-col font-parkinsans w-6/12 mx-auto">
      <div
        v-if="error"
        class="flex flex-col text-red-500 text-base mb-4 text-center"
      >
        {{ error.toLowerCase() }}
      </div>

      <input
        v-model="form.email"
        type="email"
        class="pl-1.5 border-b-2 border-gray-500 bg-transparent px-6 py-2 font-bold transition-all duration-200 text-white focus:outline-none focus:border-white"
        placeholder="email"
        name="email"
        required
      >
      <input
        v-model="form.username"
        type="text"
        class="pl-1.5 border-b-2 border-gray-500 bg-transparent px-6 py-2 font-bold transition-all duration-200 text-white focus:outline-none focus:border-white"
        placeholder="username"
        name="uname"
        required
      >
      <input
        v-model="form.password"
        type="password"
        class="pl-1.5 border-b-2 border-gray-500 bg-transparent px-6 py-2 font-bold transition-all duration-200 text-white focus:outline-none focus:border-white"
        placeholder="password"
        name="psw"
        required
      >

      <button
        class="bg-transparent block h-max w-max border-none mx-auto py-3"
        :disabled="loading"
        @click.prevent="handleSubmit"
      >
        <span class="text-gray-400 hover:text-white font-bold transition-all duration-200">
          {{ loading ? 'signing up...' : 'sign up' }}
        </span>
      </button>

      <div class="text-sm text-gray-400 text-center mt-4">
        already have an account?
        <NuxtLink to="/login">
          <span class="text-gray-400 hover:text-white font-bold transition-all duration-200">log in</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
