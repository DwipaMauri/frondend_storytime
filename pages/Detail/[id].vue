<script setup>
// API Call
const config = useRuntimeConfig(); 
const apiUrl = config.public.apiBase; 
const route = useRoute();
const storiesId = ref([]);
const storyId = route.params.id;

const fetchStoriedId = async () => {
    try {
        const response = await $fetch(`${apiUrl}/api/stories/${storyId}`);
        storiesId.value = response?.data || [];
        // console.log("NI STORIES ID",storiesId.value);
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