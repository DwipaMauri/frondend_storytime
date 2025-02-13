<script setup>
const props = defineProps({
    currentStory: {
        type: Object,
        required: true,
    },
});

// Konfigurasi API
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// === Bagian Similar Stories ===
const similarStories = ref([]);

// Fungsi memastikan URL gambar lengkap
const getImageUrl = (url) => {
    if (url && !url.startsWith('http')) {
        return `${apiUrl}/storage/${url}`;
    }
    return url;
};

// Fungsi format tanggal
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

// === Bagian Toggle Bookmark (diambil dari kode kedua) ===
const userIconSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/></svg>`;

const bookmarkedStories = ref(new Set());
const token = useCookie('token').value;

const fetchBookmarkedStories = async () => {
    // Ambil dari localStorage terlebih dahulu
    const storedBookmarks = localStorage.getItem('bookmarkedStories');
    if (storedBookmarks) {
        bookmarkedStories.value = new Set(JSON.parse(storedBookmarks));
    }

    if (!token) return;

    try {
        const bookmarks = await $fetch(`${apiUrl}/api/bookmarks`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });

        const apiBookmarks = new Set(bookmarks.map(b => b.story_id));
        bookmarkedStories.value = new Set([...bookmarkedStories.value, ...apiBookmarks]);

        await saveToLocalStorage();
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
    }
};

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

        if (response.is_bookmarked) {
            bookmarkedStories.value.add(storyId);
        } else {
            bookmarkedStories.value.delete(storyId);
        }

        await saveToLocalStorage();
        alert(response.message);
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        alert(error.data?.message || 'An error occurred while toggling bookmark.');
    }
};

const isBookmarked = (storyId) => bookmarkedStories.value.has(storyId);
</script>

<template>
    <div class="mt-28 px-12">
        <h2 class="text-2xl font-bold mb-6 border-b pb-3 border-gray-300">Similar Stories</h2>
        <div v-if="similarStories.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="story in similarStories" :key="story.id" class="transition group">
                <!-- Container gambar dengan tombol bookmark -->
                <div class="relative">
                    <NuxtLink :to="`/detail/${story.id}`">
                        <img :src="story.content_images && story.content_images[0] ? getImageUrl(story.content_images[0].url) : ''"
                            alt="Story Image"
                            class="w-full h-96 object-cover rounded-t-lg transition-opacity duration-300 group-hover:opacity-75" />
                    </NuxtLink>
                    <button @click.stop="handleBookmarkClick(story.id)"
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
                <!-- Detail cerita -->
                <NuxtLink :to="`/detail/${story.id}`">
                    <h4 class="text-xl font-semibold mt-2">{{ story.title }}</h4>
                    <p class="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                        {{ story.preview_content }}
                    </p>
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
