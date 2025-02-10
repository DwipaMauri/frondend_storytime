<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRuntimeConfig } from '#app';

const props = defineProps({
    currentStory: {
        type: Object,
        required: true,
    },
});

const similarStories = ref([]);
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// Function to ensure the image URL is complete
const getImageUrl = (url) => {
    if (url && !url.startsWith('http')) {
        return `${apiUrl}/storage/${url}`;
    }
    return url;
};

// Function to format date
const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
};

const fetchStories = async () => {
    try {
        const response = await $fetch(`${apiUrl}/api/stories`, {
            headers: { 'Content-Type': 'application/json' },
        });
        const storiesData = response.data || response;
        console.log("Fetched stories:", storiesData);

        similarStories.value = storiesData.filter((story) => {
            if (story.category && props.currentStory.category) {
                return (
                    String(story.category.id) === String(props.currentStory.category.id) &&
                    story.id !== props.currentStory.id
                );
            }
            return false;
        });

        console.log("Filtered similar stories:", similarStories.value);
    } catch (error) {
        console.error("Error fetching similar stories:", error);
    }
};

onMounted(() => {
    if (props.currentStory && props.currentStory.category) {
        fetchStories();
    } else {
        console.log("Current story or category is not available on mounted.");
    }
});

watch(
    () => props.currentStory,
    (newVal) => {
        if (newVal && newVal.category) {
            fetchStories();
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="mt-28 px-12">
        <h2 class="text-2xl font-bold mb-4">Similar Stories</h2>
        <div v-if="similarStories.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="story in similarStories" :key="story.id" class="transition">
                <NuxtLink :to="`/detail/${story.id}`">
                    <img :src="story.content_images && story.content_images[0] ? getImageUrl(story.content_images[0].url) : ''"
                        alt="Story Image" class="w-full h-96 object-cover rounded-t-lg" />
                    <h4 class="text-xl font-semibold mt-2">{{ story.title }}</h4>

                    <!-- Deskripsi dengan line-clamp -->
                    <p class="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                        {{ story.preview_content }}
                    </p>

                    <!-- Bagian bawah: Avatar, Tanggal, Kategori -->
                    <div class="flex items-center justify-between mt-6">
                        <div class="flex items-center gap-2">
                            <img :src="story.user.profile_image" alt="Avatar" class="w-8 h-8 rounded-full" />
                            <span class="text-gray-700 font-medium">{{ story.user.name }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="text-gray-500">{{ formatDate(story.created_at) }}</span>
                            <span class="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-md">
                                {{ story.category.name }}
                            </span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
        <div v-else>
            <p>No similar stories found!</p>
        </div>
    </div>
</template>
