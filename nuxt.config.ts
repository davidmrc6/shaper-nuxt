import { URL, fileURLToPath } from 'url'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/eslint',
  ],
  devtools: { enabled: false },
  css: ['@/assets/css/main.css'],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
  alias: {
    '@': fileURLToPath(new URL('./', import.meta.url)),
  },
  compatibilityDate: '2024-11-01',
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  googleFonts: {
    families: {
      Parkinsans: [300, 700],
    },
  },
})
