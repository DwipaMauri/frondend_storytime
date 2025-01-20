// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import { resolve } from "path";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  //Create an App
  alias: {
    "@": resolve(__dirname, "/"),
  },
  css: ["~/assets/main.scss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [
    '~/plugins/axios.js'  // This is the correct way to add a plugin
  ],
  runtimeConfig: {
    public: {
      // Define the default API URL, can be overridden by .env
      apiBase: "http://localhost:8000",// Fallback to localhost if not set
    },
  },
});
