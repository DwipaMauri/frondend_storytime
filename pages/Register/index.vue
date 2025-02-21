<script setup>
// API Call
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// Jika ada token dan user di cookie 
onMounted(() => {
  const tokenCookie = useCookie("token");
  const userCookie = useCookie("user");

  if (tokenCookie.value && userCookie.value) {
    // Tampilkan alert sukses
    alert(response.message || "User registered successfully.");

    // If token exists, redirect to home/dashboard
    navigateTo("/");
  }
});

// State for registration
const user = ref(null);
const token = ref(null);
const registerState = reactive({ 
  name: "",
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
  error: "",
  errors: {},
  isLoading: false,
});

// Password visibility states
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Toggle password visibility
const togglePasswordVisibility = (field) => {
  if (field === "password") {
    showPassword.value = !showPassword.value;
  } else {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

// Registration handler
const handleRegister = async () => { 
  // Reset previous states
  registerState.error = ""; 
  registerState.errors = {};
  registerState.isLoading = true;

  try {
    // API call to register
    const response = await $fetch(`${apiUrl}/api/register`, { 
      method: "POST", 
      body: {
        name: registerState.name,
        username: registerState.username,
        email: registerState.email,
        password: registerState.password,
        password_confirmation: registerState.password_confirmation,
      },
      credentials: "include",
    });

    // Handle successful response
    if (response) {
      // Set user in state
      user.value = response.user;
      token.value = response.token;

      // Set cookies
      const userCookie = useCookie("user", {
        maxAge: 7 * 24 * 60 * 60, 
        secure: true,
        httpOnly: false,
        sameSite: "strict",
      });
      const tokenCookie = useCookie("token", {
        maxAge: 7 * 24 * 60 * 60,
        secure: true,
        httpOnly: false,
        sameSite: "strict",
      });

      // Store stringified user and token
      userCookie.value = JSON.stringify(response.user);
      tokenCookie.value = response.token;

      // Redirect to home page
      navigateTo("/");
    }
  } catch (err) {
    // Handle error responses
    if (err.data && err.data.errors) {
      registerState.errors = err.data.errors;
    } 
    registerState.error = err.data?.message || "Registration failed"; 
    console.error("Registration error:", err);
  } finally {
    // Reset loading state setelah proses selesai
    registerState.isLoading = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 bg-white border border-gray-200 rounded-lg shadow-lg">
      <!-- Bagian Kiri: Ilustrasi dan Deskripsi -->
      <div class="p-8 bg-green-50 flex flex-col justify-between items-start">
        <!-- Logo -->
        <div class="mb-6">
          <img src="public/img/image 15.png" alt="Storytime Logo" class="h-10" />
        </div>

        <!-- Teks Deskripsi -->
        <div>
          <h1 class="text-5xl font-bold text-gray-800 leading-tight mb-6">
            Join the World's Most-Loved <br />
            Social Storytelling Platform!
          </h1>
          <p class="text-gray-600 mb-10 text-2xl">
            Create an account to explore interesting articles, connect with
            <br />
            like-minded people, and share your own stories.
          </p>
        </div>

        <!-- Ilustrasi -->
        <div class="w-full flex justify-center">
          <img src="/img/undraw_on_the_office_re_cxds 1.png" alt="Story Illustration" class="max-w-[500px] h-auto" />
        </div>
      </div>

      <!-- Bagian Kanan: Form Registrasi -->
      <div class="p-12">
        <h2 class="text-2xl font-bold mb-5 text-gray-800">Create Account</h2>

        <!-- Global Error Message -->
        <div v-if="registerState.error" class="text-red-500 mb-4 bg-red-50 p-3 rounded">
          {{ registerState.error }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Input Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-3">Name</label>
            <input v-model="registerState.name" type="text" id="name" placeholder="Enter your name"
              class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600"
              required />
            <p v-if="registerState.errors.name" class="text-red-500 text-sm mt-1">
              {{ registerState.errors.name[0] }}
            </p>
          </div>

          <!-- Input Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-3">Username</label>
            <input v-model="registerState.username" type="text" id="username" placeholder="Enter your username"
              class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600"
              required />
            <p v-if="registerState.errors.username" class="text-red-500 text-sm mt-1">
              {{ registerState.errors.username[0] }}
            </p>
          </div>

          <!-- Input Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-3">Email</label>
            <input v-model="registerState.email" type="email" id="email" placeholder="Enter your email"
              class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600"
              required />
            <p v-if="registerState.errors.email" class="text-red-500 text-sm mt-1">
              {{ registerState.errors.email[0] }}
            </p>
          </div>

          <!-- Input Password -->
          <div class="relative">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-3">Password</label>
            <div class="relative">
              <input v-model="registerState.password" :type="showPassword ? 'text' : 'password'" id="password"
                placeholder="Enter your chosen password"
                class="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600"
                required />
              <span @click="togglePasswordVisibility('password')"
                class="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5 text-gray-500 mr-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.6 1.857-1.82 3.405-3.458 4.434" />
                </svg>
              </span>
            </div>
            <p v-if="registerState.errors.password" class="text-red-500 text-sm mt-1">
              {{ registerState.errors.password[0] }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div class="relative">
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-3">Confirm Password</label>
            <div class="relative">
              <input v-model="registerState.password_confirmation" :type="showConfirmPassword ? 'text' : 'password'"
                id="confirm-password" placeholder="Re-enter your chosen password"
                class="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600"
                required />
              <span @click="togglePasswordVisibility('confirm-password')"
                class="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5 text-gray-500 mr-3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.6 1.857-1.82 3.405-3.458 4.434" />
                </svg>
              </span>
            </div>
            <p v-if="registerState.errors.password_confirmation" class="text-red-500 text-sm mt-1">
              {{ registerState.errors.password_confirmation[0] }}
            </p>
          </div>

          <!-- Submit Button -->
          <div style="margin-top: 15px">
            <button type="submit" :disabled="registerState.isLoading"
              class="w-[185px] py-[12px] bg-[#466543] text-white rounded-md text-[14px] font-semibold text-center hover:bg-lime-900 focus:outline-none focus:ring-2 focus:ring-green-800">
              <span v-if="registerState.isLoading">Creating...</span>
              <span v-else>Create Account</span>
            </button>
          </div>
        </form>

        <!-- Link to Login -->
        <p class="mt-8 text-sm text-gray-600">
          Already have an account?
          <a href="/login" class="text-gray asparagus Tr-700 font-medium">Login</a>
        </p>
      </div>
    </div>
  </div>
</template>