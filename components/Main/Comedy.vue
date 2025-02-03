<script setup>
// Props for the component
const props = defineProps({
    stories: {
        type: Array,
        required: true
    }
});
console.log('Comedy Stories:', props.stories);

// Default image if there's no image
const userIconSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M12 4a4 4 0 0 1 4 4a4 4 0 1 1-8 0a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/></svg>`;

// API Call
const config = useRuntimeConfig(); // Get the runtime config
const apiUrl = config.public.apiBase; // Access the API base URL

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

// Function to format the date
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
    <div class="px-10 py-6">
        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            <!-- Card 1: Guardians of the Galaxy (Besar) -->
            <div v-for="(story) in stories.slice(0, 1)" :key="story.id"
                class="md:col-span-2 rounded-lg overflow-hidden relative group">
                <!-- Gambar Card -->
                <div class="relative inline-block">
                    <!-- Gambar -->
                    <NuxtLink :to="`/detail/${story.id}`">
                        <img :src="getImageUrl(story.content_images[0])" :alt="story.title"
                            class="w-full h-64 md:h-[940px] object-cover group-hover:opacity-75 transition-opacity duration-300" />
                    </NuxtLink>

                    <!-- Ikon Bookmark -->
                    <div
                        class="absolute bottom-5 right-5 bg-green-800 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                            <path fill="#fff"
                                d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
                        </svg>
                    </div>
                </div>

                <div>
                    <h3 class="text-lg md:text-2xl font-bold text-black mt-2">
                        {{ story.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                        {{ story.preview_content }}
                    </p>
                    <div class="flex items-center justify-between mt-4 text-sm">
                        <div class="flex items-center gap-2">
                            <img src="public/img/Ellipse 66 (4).png" alt="Profile Juliana"
                                class="w-8 h-8 rounded-full" />
                            <span class="text-gray-800 font-medium">{{ story.user.name }}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">{{ formatDate(story.created_at) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Card 2 & 3 -->
            <div>
                <div v-for="(story, index) in stories.splice(1, 2)" :key="index"
                    class="rounded-lg overflow-hidden group mb-6">
                    <div class="relative inline-block">
                        <!-- Gambar -->
                        <NuxtLink :to="`/detail/${story.id}`">
                            <img :src="getImageUrl(story.content_images[0])" :alt="story.title"
                                class="w-[500px] h-auto max-h-80 object-cover group-hover:opacity-75 transition-opacity duration-300" />
                        </NuxtLink>

                        <!-- Ikon Bookmark di kanan -->
                        <div
                            class="absolute bottom-5 right-5 bg-green-800 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                                <path fill="#fff"
                                    d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold text-black mt-2">{{ story.title }}</h3>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                            {{ story.preview_content }}
                        </p>
                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center gap-2">
                                <img src="public/img/Ellipse 66 (3).png" alt="Profile Langgam"
                                    class="w-8 h-8 rounded-full mt-6" />
                                <span class="text-gray-800 font-medium mt-6">{{ story.user.name }}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 mt-8">{{ formatDate(story.created_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>