<script setup>
const userIconSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/></svg>`;

const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

const props = defineProps({
    stories: {
        type: Array,
        required: true
    }
});

const bookmarkedStories = ref(new Set());
const token = useCookie('token').value;

// Load bookmarks from both localStorage and API
const fetchBookmarkedStories = async () => {
    // First load from localStorage
    const storedBookmarks = localStorage.getItem('bookmarkedStories');
    if (storedBookmarks) {
        bookmarkedStories.value = new Set(JSON.parse(storedBookmarks));
    }

    // Then fetch from API if user is logged in
    if (!token) return;

    try {
        const bookmarks = await $fetch(`${apiUrl}/api/bookmarks/toggle`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });
        // Merge API bookmarks with localStorage
        const apiBookmarks = new Set(bookmarks.map(b => b.story_id));
        bookmarkedStories.value = new Set([...bookmarkedStories.value, ...apiBookmarks]);

        // Update localStorage with merged bookmarks
        await saveToLocalStorage();
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
    }
};

// Save bookmarks to localStorage
const saveToLocalStorage = async () => {
    await nextTick();
    localStorage.setItem('bookmarkedStories', JSON.stringify(Array.from(bookmarkedStories.value)));
};

onMounted(() => {
    fetchBookmarkedStories();
});

const handleBookmarkClick = (storyId) => {
    if (!token) {
        alert('You need to log in to toggle a bookmark.');
        return;
    }
    toggleBookmark(storyId);
};

const toggleBookmark = async (storyId) => {
    try {
        const response = await $fetch(`${apiUrl}/api/bookmarks/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: { story_id: storyId }
        });

        // Update state bookmark locally
        if (bookmarkedStories.value.has(storyId)) {
            bookmarkedStories.value.delete(storyId);
        } else {
            bookmarkedStories.value.add(storyId);
        }

        // Save to localStorage after state update
        await saveToLocalStorage();

        alert(response.message);
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        alert(error.data?.message || 'An error occurred while toggling bookmark.');
    }
};

const isBookmarked = (storyId) => bookmarkedStories.value.has(storyId);

const getImageUrl = (image) => {
    const imagePath = image && typeof image === 'object' ? image.url : '';
    if (imagePath && !imagePath.startsWith('http')) {
        return `${apiUrl}/storage/${imagePath}`;
    }
    return imagePath || userIconSvg;
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
    <div v-if="stories.length === 0" class="text-center text-gray-500">
        <p>No stories found.</p>
    </div>

    <div v-else class="overflow-x-auto scrollbar-hide whitespace-nowrap">
        <div class="flex gap-4">
            <div v-for="story in stories" :key="story.id"
                class="min-w-[420px] max-w-[500px] overflow-hidden flex-shrink-0 rounded-lg group transition duration-300">
                <div class="relative">
                    <nuxt-link :to="`/detail/${story.id}`">
                        <img :src="getImageUrl(story.content_images[0])" alt="Story Image"
                            class="w-[700px] h-[530px] object-cover transition-opacity duration-300 rounded-t-lg group-hover:opacity-75" />
                    </nuxt-link>

                    <button @click="handleBookmarkClick(story.id)"
                        class="absolute bottom-5 right-5 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-300"
                        :class="isBookmarked(story.id) ? 'bg-[#1C1C1C]' : 'bg-green-800 hover:bg-[#3B4F3A]'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                            <transition name="fade-scale" mode="out-in">
                                <path v-if="isBookmarked(story.id)" key="bookmarked" fill="white"
                                    d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.768q.691 0 1.153.463t.463 1.153V19.5l-6-2.577z" />
                                <g v-else key="not-bookmarked">
                                    <path fill="white"
                                        d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
                                </g>
                            </transition>
                        </svg>
                    </button>
                </div>

                <div class="mt-2 bg-white transition duration-300">
                    <h3
                        class="text-lg font-semibold text-gray-800 truncate transition duration-300 group-hover:text-[#466543]">
                        {{ story.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3 transition duration-300">
                        {{ story.preview_content }}
                    </p>
                    <div class="flex items-center justify-between mt-4 text-sm text-[#222222] transition duration-300">
                        <div class="flex items-center gap-2">
                            <img :src="story.user.profile_image" alt="Avatar" class="w-8 h-8 rounded-full" />
                            <span class="font-medium truncate transition duration-300">
                                {{ story.user.name }}
                            </span>
                        </div>
                        <div>
                            <span class="transition duration-300">
                                {{ formatDate(story.created_at) || 'Date' }}
                            </span>
                            <span class="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-md transition duration-300">
                                {{ story.category.name }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>