<script setup>
import { onMounted } from 'vue';

// Default image if there's no image
const userIconSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/></svg>`;

// API Call
const config = useRuntimeConfig(); // Get the runtime config
const apiUrl = config.public.apiBase; // Access the API base URL
const token = useCookie("token").value;

// Define the prop as 'userStories'
const props = defineProps({
    userStories: {
        type: Array,
        required: true,
    },
});
console.log('User Stories:', props.userStories);

// Modal visibility state
const isDeleteModalVisible = ref(false);
const storyToDelete = ref(null);

// Function to show the delete modal
const showDeleteModal = (story) => {
    storyToDelete.value = story;
    isDeleteModalVisible.value = true;
};

// Function to close the delete modal
const closeDeleteModal = () => {
    storyToDelete.value = null;
    isDeleteModalVisible.value = false;
};

// Function to delete the story
// const deleteStory = async () => {
//     if (!storyToDelete.value) return;

//     try {
//         // Call the delete API
//         const response = await $fetch(`${apiUrl}/api/stories/${storyToDelete.value.id}`, {
//             method: "DELETE",
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
//             },
//         });

//         // Check API response
//         if (response?.message === "Story deleted successfully") {
//             // Remove story from the list
//             const index = props.userStories.findIndex(
//                 (story) => story.id === storyToDelete.value.id
//             );
//             if (index !== -1) props.userStories.splice(index, 1);

//             // Notify the user (optional: toast)
//             alert("Story successfully deleted!");

//             // Close modal
//             closeDeleteModal();
//         } else {
//             console.error("Failed to delete the story:", response?.message || "Unknown error");
//             alert("Failed to delete the story. Please try again.");
//         }
//     } catch (error) {
//         console.error("Error deleting story:", error.message || error);
//         alert("An error occurred while deleting the story. Please try again.");
//     }
// };

const isLoading = ref(false);

const deleteStory = async () => {
    if (!storyToDelete.value) return;

    isLoading.value = true; // Mulai loading
    try {
        // Delete API call
        const response = await $fetch(`${apiUrl}/api/stories/${storyToDelete.value.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${useCookie('token').value}`,
            },
        });

        if (response?.message === "Story deleted successfully") {
            const index = props.userStories.findIndex(
                (story) => story.id === storyToDelete.value.id
            );
            if (index !== -1) props.userStories.splice(index, 1);

            alert("Story successfully deleted!");
            closeDeleteModal();
        } else {
            console.error("Error deleting:", response?.message || "Unknown error");
            alert("Failed to delete story.");
        }
    } catch (error) {
        console.error("Error:", error.message || error);
        alert("An error occurred. Please try again.");
    } finally {
        isLoading.value = false; // Hentikan loading
    }
};

// Function to get the image URL or return the default icon
const getImageUrl = (image) => {
    const imagePath = image && typeof image === "object" ? image.url : "";

    if (imagePath && !imagePath.startsWith("http")) {
        // Check if imagePath is relative and build full URL
        return `${apiUrl}/storage/${imagePath}`;
    }
    return imagePath || userIconSvg; // Fallback to the default icon
};

// Function to format the date
const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

// Create a ref for bookmark State
const bookmarkStates = ref({});

const fetchBookmarkStatus = async () => {
    if (!token) return; // dont fetch if user not Logged in or token expired.
    try {
        const bookmarkResponse = await $fetch(`${apiUrl}/api/bookmarks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const bookmarkedIds = new Set(bookmarkResponse.data.map(story => story.id));

        const newBookmarkStates = {};
        props.userStories.forEach(story => {
            newBookmarkStates[story.id] = bookmarkedIds.has(story.id)
        });

        bookmarkStates.value = newBookmarkStates;
    } catch (error) {
        console.error("Failed to fetch bookmarks: ", error);
    }
}

watch(() => props.userStories, (newStories) => {
    if (newStories) {
        fetchBookmarkStatus();
    }
}, { immediate: true });

onMounted(async () => {
    // console.log("component mounted...................")
    await nextTick();
    fetchBookmarkStatus();
});

// Function to navigate to the edit story page
// const navigateToEdit = (storyId) => {
//     router.push(`/story/edit/${storyId}`);
// };

// Function to toggle bookmark status
const toggleBookmark = async (story) => {
    console.log("Toggling bookmark for story:", story);

    const token = useCookie("token").value;

    if (!token) {
        alert("Session expired or not logged in. Please log in to continue.");
        router.push("/login"); // Arahkan pengguna ke halaman login
        return;
    }

    try {
        const response = await $fetch(`${apiUrl}/api/bookmarks/toggle`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: { story_id: story.id },
        });

        bookmarkStates.value = {
            ...bookmarkStates.value,
            [story.id]: response.is_bookmarked
        };

        alert(response.is_bookmarked ? "Bookmark successfully added!" : "Bookmark remove successfully!")
    } catch (error) {
        console.error("Error toggling bookmark:", error.message || error);
    }
};
</script>


<template>
    <!-- Loop through the user stories -->
    <div v-if="userStories.length === 0" class="text-center text-gray-500">
        <p>No stories found.</p>
    </div>
    <NuxtLink :to="`/Detail/${story.id}`" v-else v-for="story in userStories" :key="story.id"
        class="rounded-lg bg-white flex flex-col max-w-sm group relative">
        <!-- Card Image with Buttons -->
        <div class="relative">
            <img :src="getImageUrl(story.content_images[0])" alt="Card Image"
                class="rounded-t-lg h-96 group-hover:opacity-75 transition-opacity duration-300" />
            <!-- Buttons Section -->
            <div class="absolute bottom-6 left-3/4 transform -translate-x-1/2 flex space-x-3 z-10">
                <!-- Edit Button -->
                <NuxtLink :to="`/story/Edit/${story.id}`"
                    class="w-10 h-10 bg-[#466543] rounded-full flex items-center justify-center hover:bg-lime-900 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="white" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.128 19.585a4.5 4.5 0 01-1.691 1.071l-3.09 1.03 1.03-3.09a4.5 4.5 0 011.071-1.691L16.862 3.487z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 7.5l6 6" />
                    </svg>
                </NuxtLink>

                <!-- Bookmark Button -->
                <button @click.prevent="() => { console.log('Bookmark clicked'); toggleBookmark(story); }"
                    class="w-10 h-10 bg-[#466543] rounded-full flex items-center justify-center hover:bg-lime-900 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                        <path v-if="bookmarkStates[story.id]" fill="white"
                            d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.768q.691 0 1.153.463t.463 1.153V19.5l-6-2.577z" />
                        <path v-else fill="white"
                            d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
                    </svg>
                </button>

                <!-- Delete Button -->
                <button @click.prevent="showDeleteModal(story)"
                    class="w-10 h-10 bg-[#466543] rounded-full flex items-center justify-center hover:bg-lime-900 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="white" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-6.964 9a2.25 2.25 0 002.25 2.25h6.428a2.25-2.25 0 002.25-2.25V8.25H7.286v10.5z" />
                        <path stroke-linejoin="round"
                            d="M15 4.5V3.75a1.5 1.5 0 00-1.5-1.5h-3a1.5 1.5 0 00-1.5 1.5V4.5m-3.75 0h10.5" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Card Content -->
        <div class="p-1 flex flex-col flex-grow mb-2">
            <h2 class="text-lg font-semibold mt-2 group-hover:text-[#466543] transition-colors duration-300">
                {{ story.title }}
            </h2>
            <div class="mt-4">
                <p class="text-gray-600 text-sm flex-grow">
                    {{ story.preview_content || "No preview content available." }}
                </p>
            </div>
            <div class="mt-5 flex justify-between items-center">
                <span class="bg-[#F0F5ED] text-[#466543] px-3 py-1 rounded-md">
                    {{ story.category }}
                </span>
                <span class="text-normal font-light text-gray-900">
                    {{ formatDate(story.created_at) }}
                </span>
            </div>
        </div>
    </NuxtLink>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalVisible"
        class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-70">
            <h2 class="text-xl font-bold text-[#222222] mb-4 text-center">Delete Story</h2>
            <p class="text-gray-700 text-center mb-6">Are you sure want to delete this story?</p>
            <div class="flex justify-center space-x-8">
                <button @click="closeDeleteModal"
                    class="px-6 py-2 rounded-md border-2 border-[#466543] text-[#466543] hover:text-black hover:border-black transition">
                    Cancel
                </button>
                <button @click="deleteStory"
                    class="px-6 py-2 rounded-md bg-[#466543] text-white hover:bg-lime-900 transition">
                    Delete
                </button>
            </div>
        </div>
    </div>

    <div v-if="isLoading" class="text-center text-gray-500">
        <p>Deleting story, please wait...</p>
    </div>
</template>