<script setup>
// Ambil API URL dari config
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// Props untuk daftar cerita
const props = defineProps({
    stories: {
        type: Array,
        required: true,
    },
});

// State untuk menyimpan daftar bookmark
const bookmarkedStories = ref(new Set());
const token = useCookie('token').value;

// Ambil daftar bookmark dari API dan localStorage
const fetchBookmarkedStories = async () => {
    const storedBookmarks = localStorage.getItem('bookmarkedStories');
    if (storedBookmarks) {
        bookmarkedStories.value = new Set(JSON.parse(storedBookmarks));
    }

    if (!token) return;

    try {
        const bookmarks = await $fetch(`${apiUrl}/api/bookmarks`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        const apiBookmarks = new Set(bookmarks.map((b) => b.story_id));
        bookmarkedStories.value = new Set([...bookmarkedStories.value, ...apiBookmarks]);
        saveToLocalStorage();
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
    }
};

// Simpan daftar bookmark ke localStorage
const saveToLocalStorage = () => {
    localStorage.setItem('bookmarkedStories', JSON.stringify(Array.from(bookmarkedStories.value)));
};

// Ambil daftar bookmark saat komponen dipasang
onMounted(() => {
    fetchBookmarkedStories();
});

// Toggle bookmark
const toggleBookmark = async (storyId) => {
    if (!token) {
        alert('You need to log in to toggle a bookmark.');
        return;
    }

    try {
        const response = await $fetch(`${apiUrl}/api/bookmarks/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: { story_id: storyId },
        });

        if (response.bookmarked) {
            bookmarkedStories.value.add(storyId); // Tambahkan ke daftar bookmark
        } else {
            bookmarkedStories.value.delete(storyId); // Hapus dari daftar bookmark
        }

        saveToLocalStorage(); // Simpan perubahan ke localStorage
        alert(response.message); // Tampilkan pesan dari API
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        alert(error.data?.message || 'An error occurred while toggling bookmark.');
    }
};

// Cek apakah story sudah di-bookmark
const isBookmarked = (storyId) => bookmarkedStories.value.has(storyId);

// Ambil URL gambar
const getImageUrl = (image) => {
    const imagePath = image && typeof image === 'object' ? image.url : '';
    if (imagePath && !imagePath.startsWith('http')) {
        return `${apiUrl}/storage/${imagePath}`;
    }
    return imagePath;
};

// Format tanggal
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
        <div class="flex gap-6">
            <div v-for="story in stories.slice(0, 6)" :key="story.id"
                class="min-w-[420px] max-w-[500px] overflow-hidden flex-shrink-0 rounded-lg group transition duration-300">
                <div class="relative">
                    <nuxt-link :to="`/detail/${story.id}`">
                        <img :src="getImageUrl(story.content_images[0])" alt="Story Image"
                            class="w-[700px] h-[530px] object-cover transition-opacity duration-300 rounded-t-lg group-hover:opacity-75 mt-2" />
                    </nuxt-link>

                    <button @click="toggleBookmark(story.id)"
                        class="absolute bottom-5 right-5 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-300"
                        :class="isBookmarked(story.id) ? 'bg-[#1C1C1C]' : 'bg-green-800 hover:bg-[#3B4F3A]'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                            <path v-if="isBookmarked(story.id)" fill="white"
                                d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.768q.691 0 1.153.463t.463 1.153V19.5l-6-2.577z" />
                            <path v-else fill="white"
                                d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
                        </svg>
                    </button>
                </div>

                <div class="mt-2 bg-white transition duration-300">
                    <h3
                        class="text-lg font-semibold text-gray-800 truncate transition duration-300 group-hover:text-[#466543]">
                        {{ story.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3 transition duration-300"
                        v-text="story.preview_content" v-html="story.preview_content">
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

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}
</style>