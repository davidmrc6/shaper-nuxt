import { URL, fileURLToPath } from "url";

export default defineNuxtConfig({
  modules: ["@nuxtjs/google-fonts", "@pinia/nuxt"],
  googleFonts: {
    families: {
      Parkinsans: [300, 700],
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  alias: {
    "@": fileURLToPath(new URL("./", import.meta.url)),
  },
  css: ["@/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
});
