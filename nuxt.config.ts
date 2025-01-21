// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          "@": ["."],
          "@/*": ["./*"]
        }
      }
    }
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "floating-vue/nuxt",
    "@nuxt/test-utils/module"
  ]
});
