<script setup>
// Default image if there's no image
const userIconSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/></svg>`;

// API Call
const config = useRuntimeConfig(); // Get the runtime config
const apiUrl = config.public.apiBase; // Access the API base URL

// Define the prop as 'stories' since that's what you're passing
const props = defineProps({
    stories: {
        type: Array,
        required: true
    }
});

// Function to get the image URL or return the default icon
const getImageUrl = (image) => {
    // Ensure image is an object and has a valid url property
    const imagePath = image && typeof image === 'object' ? image.url : '';

    if (imagePath && !imagePath.startsWith('http')) {
        // Check if imagePath is relative and build full URL
        return `${apiUrl}/storage/${imagePath}`;
    }
    return imagePath || userIconSvg; // Fallback to the default icon
};

const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};
</script>

<template>
    <!-- Check if there are any stories -->
    <div v-if="stories.length === 0" class="text-center text-gray-500">
        <p>No stories found.</p>
    </div>

    <!-- Scrollable horizontal list -->
    <div v-else class="overflow-x-auto scrollbar-hide whitespace-nowrap">
        <div class="flex gap-4">
            <div v-for="story in stories" :key="story.id"
                class="min-w-[420px] max-w-[500px] overflow-hidden flex-shrink-0 rounded-lg">

                <!-- Image with Bookmark Icon -->
                <div class="relative">
                    <nuxt-link :to="`/detail/${story.id}`">
                        <img :src="getImageUrl(story.content_images[0])" alt="Story Image"
                            class="w-[700px] h-[480px] object-cover hover:opacity-75 transition-opacity duration-300 rounded-t-lg" />
                    </nuxt-link>

                    <!-- Bookmark Icon -->
                    <div
                        class="absolute bottom-5 right-5 bg-green-800 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                            <path fill="#fff"
                                d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
                        </svg>
                    </div>
                </div>

                <!-- Content -->
                <div class="mt-4 bg-white">
                    <h3 class="text-lg font-semibold text-gray-800 truncate">{{ story.title }}</h3>
                    <p class="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                        {{ story.preview_content }}
                    </p>
                    <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
                        <div class="flex items-center gap-2">
                            <img src="public/img/Ellipse 66.png" alt="Avatar" class="w-8 h-8 rounded-full" />
                            <span class="font-medium truncate">{{ story.user.name }}</span>
                        </div>
                        <div>
                            <span>{{ formatDate(story.created_at) || 'Date' }}</span>
                            <span class="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-md">
                                {{ story.category.name }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
