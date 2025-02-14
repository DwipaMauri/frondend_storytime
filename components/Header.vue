<script setup>
// API Call
const config = useRuntimeConfig();  // Get the runtime config
const apiUrl = config.public.apiBase; // Access the API base URL

// State
const isDropdownOpen = ref(false);
const isLogoutModalOpen = ref(false);
const user = ref(null);

// Cookies for token and user
const tokenCookie = useCookie("token");
const userCookie = useCookie("user");

// Check authentication state
const isAuthenticated = computed(() => !!tokenCookie.value);

// Initialize user from cookies
if (userCookie.value) {
    try {
        user.value = typeof userCookie.value === "string" ? JSON.parse(userCookie.value) : userCookie.value;
    } catch (error) {
        console.error("Error parsing user cookie:", error);
        user.value = null;
    }
}

// Fetch user details
const fetchUserDetails = async () => {
    try {
        const { data, error } = await useFetch(`${apiUrl}/api/user/details`);
        if (error.value) {
            console.error("Error fetching user details:", error.value);
            return;
        }
        if (data.value?.user) {
            const fetchedUser = data.value.user;
            if (fetchedUser.profile_image) {
                fetchedUser.profile_image = `${apiUrl}/storage/${fetchedUser.profile_image}`;
            }
            user.value = fetchedUser;
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
};

// Fetch user details when mounted
onMounted(async () => {
    if (isAuthenticated.value) {
        await fetchUserDetails();
    }
});

// Get image URL or default icon
const getImageUrl = (imagePath) => {
    if (!imagePath) return userIconSvg;
    return imagePath.startsWith('http') ? imagePath : `${apiUrl}/storage/${imagePath}`;
};

// Toggle dropdown
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

// Open Logout Modal
const openLogoutModal = () => {
    isLogoutModalOpen.value = true;
};

// Confirm Logout
const confirmLogout = async () => {
    isLogoutModalOpen.value = false;
    await handleLogout();
};

// Logout function
const handleLogout = async () => {
    if (!tokenCookie.value) return;
    try {
        await $fetch(`${apiUrl}/api/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${tokenCookie.value}` },
        });
    } catch (error) {
        console.error("Error during logout:", error);
    } finally {
        tokenCookie.value = null;
        userCookie.value = null;
        user.value = null;
        navigateTo("/login");
    }
};

// Export user ref
defineExpose({ user });
</script>

<template>
    <div class="flex justify-between items-center px-12 py-5 border-b border-gray-200 bg-white">
        <NuxtLink to="/">
            <img src="/img/image 15.png" alt="Logo" class="h-10" />
        </NuxtLink>
        <div class="flex space-x-4">
            <template v-if="isAuthenticated">
                <div class="relative">
                    <button @click="toggleDropdown"
                        class="flex items-center space-x-2 text-gray-800 hover:text-gray-600">
                        <div
                            class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                            <img v-if="user?.profile_image" :src="getImageUrl(user?.profile_image)" alt="User Avatar"
                                class="w-full h-full object-cover" />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                class="text-gray-500 w-6 h-6">
                                <path fill="currentColor"
                                    d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                            </svg>
                        </div>
                        <span>{{ user?.name || "User" }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            class="w-5 h-5 text-gray-500 ml-1">
                            <path fill="currentColor" d="M7 10l5 5 5-5z" />
                        </svg>
                    </button>
                    <div v-if="isDropdownOpen"
                        class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                        <ul>
                            <li>
                                <NuxtLink to="/profile" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile
                                </NuxtLink>
                            </li>
                            <li>
                                <button @click="openLogoutModal"
                                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-else>
                <NuxtLink to="/register">
                    <button
                        class="h-10 px-4 text-[#4C6248] border border-[#4C6248] rounded-md text-sm font-medium hover:bg-[#F6F8F4]">Register</button>
                </NuxtLink>
                <NuxtLink to="/login">
                    <button
                        class="h-10 px-4 text-white bg-[#4C6248] rounded-md text-sm font-medium hover:bg-[#3B4F3A]">Login</button>
                </NuxtLink>
            </template>
        </div>
    </div>

    <Transition name="fade">
        <div v-if="isLogoutModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div class="bg-white p-8 w-80">
                <h2 class="text-2xl text-center font-bold mb-4">Logout</h2>
                <p class="text-[#212121] text-center mb-6">Are you sure you want to logout?</p>
                <div class="flex justify-center gap-8 mt-6">
                    <button @click="isLogoutModalOpen = false"
                        class="w-28 py-2 border border-[#466543] text-[#466543] rounded-lg text-lg font-medium hover:text-black hover:border-black transition">
                        Cancel
                    </button>
                    <button @click="confirmLogout"
                        class="w-28 py-2 bg-[#466543] text-white rounded-lg text-md font-medium hover:bg-[#3b5739]">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>
