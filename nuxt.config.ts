import { defineNuxtConfig } from "nuxt/config";
import { resolve } from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-02-16", // Menggunakan tanggal terbaru
  devtools: { enabled: true },

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
    "~/plugins/axios.js",  
    "~/plugins/ckeditor.ts" // Menggabungkan ckeditor ke dalam daftar plugin
  ],

  runtimeConfig: {
    public: {
      apiBase: "http://srv711690.hstgr.cloud", // API utama
      // apiBase: "http://localhost:8000", // Gunakan ini untuk pengembangan lokal
    },
  },

  vite: {
    plugins: [],
  },

  ssr: false,
});
