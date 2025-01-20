<script setup>
// API Call
const config = useRuntimeConfig();  // Get the runtime config
const apiUrl = config.public.apiBase; // Access the API base URL

// State for dropdown
const isDropdownOpen = ref(false);
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
        user.value = null; // Reset if parsing fails
    }
}

// Function to fetch user details
const fetchUserDetails = async () => {
    try {
        const { data, error } = await useFetch(`${apiUrl}/api/user/details`);

        if (error.value) {
            console.error("Error fetching user details:", error.value);
            return;
        }

        if (data.value?.user) {
            const fetchedUser = data.value.user;

            // Construct full profile image URL
            if (fetchedUser.profile_image) {
                fetchedUser.profile_image = `${apiUrl}/storage/${fetchedUser.profile_image}`;
            }

            console.log("Fetched user:", fetchedUser); // Debug log
            user.value = fetchedUser;
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
};

// Fetch user details when the component is mounted
onMounted(async () => {
    if (isAuthenticated.value) {
        await fetchUserDetails();
    }
});

// Get the image URL or return the default icon
const getImageUrl = (imagePath) => {
    console.log('Original Image Path:', imagePath);
    
    if (!imagePath) {
        console.log('No image path, using default icon');
        return userIconSvg;
    }
    
    if (imagePath.startsWith('http')) {
        console.log('Full URL image:', imagePath);
        return imagePath;
    }
    
    const fullUrl = `${apiUrl}/storage/${imagePath}`;
    console.log('Constructed Full URL:', fullUrl);
    
    return fullUrl || userIconSvg;
};

// Toggle dropdown visibility
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

// Logout function
const handleLogout = async () => {
    if (!tokenCookie.value) {
        console.error("No token available for logout.");
        return;
    }

    try {
        // Call the backend logout endpoint
        const { error } = await $fetch(`${apiUrl}/api/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokenCookie.value}`,
            },
        });

        if (error.value) {
            console.error("Error during logout:", error.value);
        } else {
            console.log("Logged out successfully from the backend.");
        }
    } catch (error) {
        console.error("An error occurred while logging out:", error);
    } finally {
        // Clear cookies
        tokenCookie.value = null;
        userCookie.value = null;

        // Reset user state
        user.value = null;

        // Redirect to login page
        navigateTo("/login");
    }
};
// Export user ref
defineExpose({ user });
</script>

<template>
    <!-- Header -->
    <div class="flex justify-between items-center px-12 py-5 border-b border-gray-200 bg-white">
        <!-- Logo -->
        <NuxtLink to="/">
            <img src="/img/image 15.png" alt="Logo" class="h-10" />
        </NuxtLink>

        <!-- Conditional Rendering -->
        <div class="flex space-x-4">
            <template v-if="isAuthenticated">
                <!-- Profile Dropdown -->
                <div class="relative">
                    <button @click="toggleDropdown"
                        class="flex items-center space-x-2 text-gray-800 hover:text-gray-600">
                        <!-- Profile Image or Default Icon -->
                        <div
                            class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                            <img v-if="user?.profile_image && user?.profile_image !== ''" :src="getImageUrl(user?.profile_image)"
                                alt="User Avatar" class="w-full h-full object-cover" />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                class="text-gray-500 w-6 h-6">
                                <path fill="currentColor"
                                    d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                            </svg>
                        </div>
                        <span>{{ user?.name || "User" }}</span>

                        <!-- Dropdown Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            class="w-5 h-5 text-gray-500 ml-1">
                            <path fill="currentColor" d="M7 10l5 5 5-5z" />
                        </svg>
                    </button>
                    <div v-if="isDropdownOpen"
                        class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                        <ul>
                            <li>
                                <NuxtLink to="/profile" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                    Profile
                                </NuxtLink>
                            </li>
                            <li>
                                <button @click="handleLogout"
                                    class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-else>
                <!-- Buttons for Register and Login -->
                <NuxtLink to="/register">
                    <button
                        class="h-10 px-4 text-[#4C6248] border border-[#4C6248] rounded-md text-sm font-medium hover:bg-[#F6F8F4] focus:outline-none focus:ring-2 focus:ring-[#4C6248]">
                        Register
                    </button>
                </NuxtLink>
                <NuxtLink to="/login">
                    <button
                        class="h-10 px-4 text-white bg-[#4C6248] rounded-md text-sm font-medium hover:bg-[#3B4F3A] focus:outline-none focus:ring-2 focus:ring-[#4C6248]">
                        Login
                    </button>
                </NuxtLink>
            </template>
        </div>
    </div>
</template>
