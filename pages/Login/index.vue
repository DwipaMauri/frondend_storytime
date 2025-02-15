<script setup>
// // API Call
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// State for user and authentication
const user = ref(null);
const token = ref(null);
const showPassword = ref(false);
const loginState = reactive({
  username_or_email: "",
  password: "",
  error: "",
  isLoading: false,
});

// Check authentication state
onMounted(() => {
  const tokenCookie = useCookie("token");
  const userCookie = useCookie("user");

  if (tokenCookie.value && userCookie.value) {
    // If token exists, redirect to home/dashboard
    navigateTo("/");
  }
});

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
}

// Login handler
const handleLogin = async () => {
  // Reset previous state
  loginState.error = "";
  loginState.isLoading = true;

  try {
    // API call to login
    console.log("Url to fetch:", `${apiUrl}/api/login`);
    // const response = await $fetch('http://localhost:8000/api/login', {
    const response = await $fetch(`${apiUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        username_or_email: loginState.username_or_email,
        password: loginState.password,
      },
      credentials: "include",
    });

    // Check if response is successful
    if (response) {
      // Set user in state
      user.value = response.user; // Assuming user object is returned
      token.value = response.token;

      // Store in cookies (secure storage)
      const userCookie = useCookie("user", {
        maxAge: 7 * 24 * 60 * 60,
        secure: true,
        httpOnly: false,
        sameSite: 'Strict',
      });
      const tokenCookie = useCookie("token", {
        maxAge: 7 * 24 * 60 * 60,
        secure: true,
        httpOnly: false,
        sameSite: 'Strict',
      });

      // Store stringified user and token
      userCookie.value = JSON.stringify(response.user);
      tokenCookie.value = response.token;

      // Tampilkan alert sukses
      alert(response.message || "User logged in successfully.");

      // Redirect to home page
      navigateTo("/");
    }
  } catch (err) {
    // Handle error from API
    loginState.error = err.data?.message || err.message || "Login failed. Please try again.";
    console.error("Login error:", err);
  } finally {
    // Reset loading state
    loginState.isLoading = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div
      class="bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <!-- Bagian Kiri: Form Login -->
      <div class="p-8">
        <div class="flex items-center mb-12">
          <NuxtLink to="/">
            <img src="public/img/image 15.png" alt="Storytime Logo" class="h-10" />
          </NuxtLink>
        </div>
        <h2 class="text-3xl font-bold mb-8 text-gray-800 ml-16 p-8">Login</h2>

        <!-- Error Message -->
        <div v-if="loginState.error" class="text-red-500 ml-24 mb-4 bg-red-50 p-3 rounded">
          {{ loginState.error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Input Username/Email -->
          <div>
            <label for="username" class="block text-sm font-quartz text-gray-700 ml-24">Username/Email</label>
            <input v-model="loginState.username_or_email" type="text" id="username"
              placeholder="Enter your username or email"
              class="mt-1 block w-[500px] p-3 border border-gray-300 rounded-md focus:ring-green-600 focus:border-green-600 ml-24"
              required />
            <!-- Input Password -->
            <div class="flex flex-col ml-24 mt-4">
              <label for="password" class="text-sm font-quartz text-gray-700">Password</label>
              <div
                class="relative flex items-center mt-1 w-[500px] border border-gray-300 rounded-md focus-within:ring-green-600 focus-within:border-green-600">
                <input v-model="loginState.password" :type="showPassword ? 'text' : 'password'" id="password"
                  placeholder="Enter your chosen password" class="flex-1 p-3 pr-10 rounded-md outline-none" required />
                <span @click="togglePasswordVisibility" class="absolute right-3 flex items-center cursor-pointer">
                  <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.6 1.857-1.82 3.405-3.458 4.434" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- Tombol Login -->
          <button type="submit" :disabled="loginState.isLoading"
            class="w-[90px] py-3 text-white bg-[#466543] rounded-md hover:bg-lime-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm font-semibold text-center ml-24"
            style="margin-top: 15px">
            {{ loginState.isLoading ? "Logging..." : "Login" }}
          </button>
        </form>
        <!-- Link ke Register -->
        <p class="mt-8 text-sm text-gray-600 ml-24">
          Don't have an account?
          <a href="/register" class="text-asparagus Tr-700 font-medium">Register</a>
        </p>
      </div>

      <!-- Bagian Kanan: Deskripsi dan Ilustrasi -->
      <div class="p-14 bg-green-50 flex flex-col justify-center">
        <h1 class="text-4xl font-bold text-gray-800 leading-tight mb-10 ml-14 mt-10">
          Welcome Back to <br />
          Story Time!
        </h1>
        <p class="text-regular-gray-900 mb-10 ml-14 text-2xl" style="color: #4b4b4b">
          Join us for an exciting journey through stories and adventures. Your
          next favorite tale awaits!
        </p>
        <img src="public/img/undraw_on_the_office_re_cxds 1.png" alt="Illustration" class="mt-10" />
      </div>
    </div>
  </div>
</template>
