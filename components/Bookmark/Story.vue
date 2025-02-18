<script setup>
const userIconSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/></svg>`;

const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

const props = defineProps({
    userStories: { type: Array, required: true },
});
const emit = defineEmits(['updateBookmarks']);

const getImageUrl = (image) => {
    const imagePath = image && typeof image === "object" ? image.url : "";
    return imagePath && !imagePath.startsWith("http") ? `${apiUrl}/storage/${imagePath}` : imagePath || userIconSvg;
};

const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
};

// State Bookmark
const bookmarkedStories = ref(new Set());
const token = useCookie('token').value;
const showBookmark = ref(null);

// Fetch daftar bookmark
const fetchBookmarkedStories = async () => {
    const storedBookmarks = localStorage.getItem('bookmarkedStories');
    if (storedBookmarks) {
        bookmarkedStories.value = new Set(JSON.parse(storedBookmarks));
    }
    if (!token) return;

    try {
        const bookmarks = await $fetch(`${apiUrl}/api/bookmarks`, { //Jika ada bookmark yang tersimpan di localStorage, itu akan dimuat dulu ke dalam state bookmarkedStories (agar cepat ditampilkan)
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });

        bookmarkedStories.value = new Set(bookmarks.map(b => b.story_id)); //Backend akan mengembalikan daftar stories yang telah di-bookmark oleh pengguna
        saveToLocalStorage();
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
    }
};

// Simpan ke localStorage
const saveToLocalStorage = () => {
    localStorage.setItem('bookmarkedStories', JSON.stringify(Array.from(bookmarkedStories.value)));
};

onMounted(() => {
    fetchBookmarkedStories();
});

// Toggle Bookmark
const handleBookmarkClick = async (storyId) => {
    if (!token) {
        alert('You need to log in to toggle a bookmark.');
        return;
    }

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
            emit('updateBookmarks', storyId);
        }
        // Hapus dari daftar userStories agar langsung hilang dari tampilan
        props.userStories.splice(props.userStories.findIndex(s => s.id === storyId), 1);

        saveToLocalStorage();
        alert(response.message);
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        alert(error.data?.message || 'An error occurred while toggling bookmark.');
    }
};

const isBookmarked = (storyId) => bookmarkedStories.value.has(storyId);
</script>

<template>
    <div v-if="userStories.length === 0" class="text-center text-gray-500">
        <p>No bookmarks found.</p>
    </div>

    <div v-else v-for="story in userStories" :key="story.id"
        class="rounded-lg bg-white flex flex-col max-w-sm group relative" @mouseenter="showBookmark = story.id"
        @mouseleave="showBookmark = null">

        <!-- Link ke detail story -->
        <nuxt-link :to="`/detail/${story.id}`" class="relative block">
            <img :src="getImageUrl(story.content_images[0])" alt="Card Image"
                class="rounded-t-lg h-96 w-full group-hover:opacity-75 transition-opacity duration-300" />
        </nuxt-link>

        <!-- Tombol Bookmark (DI LUAR nuxt-link) -->
        <button @click.stop="handleBookmarkClick(story.id)"
            class="absolute inset-0 m-auto flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 -translate-y-32"
            :class="isBookmarked(story.id) ? 'bg-[#1C1C1C]' : 'bg-green-800 hover:bg-[#3B4F3A]'">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                <path v-if="isBookmarked(story.id)" fill="white"
                    d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.768q.691 0 1.153.463t.463 1.153V19.5l-6-2.577z" />
                <path v-else fill="white"
                    d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
            </svg>
        </button>

        <div class="flex flex-col flex-grow mb-4">
            <h2 class="text-lg font-semibold mt-2 group-hover:text-[#466543] transition-colors duration-300">
                {{ story.title }}
            </h2>
            <p class="text-gray-600 text-sm flex-grow mt-3">
                {{ story.preview_content || "No preview content available." }}
            </p>
            <div class="mt-5 flex justify-between items-center">
                <span class="bg-[#F0F5ED] text-[#466543] px-3 py-1 rounded-md">
                    {{ typeof story.category === 'object' ? story.category.name : story.category }}
                </span>
                <span class="text-normal font-light text-gray-900">
                    {{ formatDate(story.created_at) }}
                </span>
            </div>
        </div>
    </div>
</template>
