// plugins/axios.js
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiBase;

    const axiosInstance = axios.create({
        baseURL: apiUrl,
    });

    nuxtApp.provide('axios', axiosInstance);
});