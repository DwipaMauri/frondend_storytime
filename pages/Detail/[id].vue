<script setup>
// API Call
const config = useRuntimeConfig(); // Get the runtime config
const apiUrl = config.public.apiBase; // Access the API base URL

const route = useRoute();
const storiesId = ref([]);
const storyId = route.params.id;

const fetchStoriedId = async () => {
    try {
        const response = await $fetch(`${apiUrl}/api/stories/${storyId}`);
        storiesId.value = response?.data || []; // Assuming your API response has a `data` field
        console.log("NI STORIES ID",storiesId.value);
    } catch (error) {
        console.error('Error fetching stories:', error);
    }
};

// Fetch stories on component mount
onMounted(async () => {
    await fetchStoriedId();
});
</script>

<template>
    <StoryDetail :storiesId="storiesId" />
</template>