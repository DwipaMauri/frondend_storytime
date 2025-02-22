<script setup>
const props = defineProps({
    storiesId: {
        type: Object,
        required: true,
    },
});

const bookmarkedStories = ref(new Set());
const token = useCookie('token').value;
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

const currentIndex = ref(0);
const isModalOpen = ref(false);

const isBookmarked = computed(() => bookmarkedStories.value.has(props.storiesId.id));

// Fetch initial bookmark status
const fetchBookmarkedStories = async () => {
    if (!token) return;
    try {
        const bookmarks = await $fetch(`${apiUrl}/api/bookmarks`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        //Menyimpan data bookmark ke state
        bookmarkedStories.value = new Set(bookmarks.map(bookmark => bookmark.story_id));

        // Simpan ke localStorage
        localStorage.setItem('bookmarkedStories', JSON.stringify(Array.from(bookmarkedStories.value)));
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
    }
};

// Toggle Bookmark
const toggleBookmark = async (storyId) => {
    if (!token) {
        alert('You need to log in to toggle a bookmark.');
        return;
    }

    try {
        const response = await $fetch(`${apiUrl}/api/bookmarks/toggle`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: { story_id: storyId }
        });

        if (response.is_bookmarked) {
            bookmarkedStories.value.add(storyId);
        } else {
            bookmarkedStories.value.delete(storyId);
        }

        // Update localStorage
        localStorage.setItem('bookmarkedStories', JSON.stringify(Array.from(bookmarkedStories.value)));

        alert(response.message);
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        alert(error.data?.message || 'An error occurred while toggling bookmark.');
    }
};

// Ambil bookmark dari localStorage saat mounted
onMounted(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedStories'));
    if (storedBookmarks) {
        bookmarkedStories.value = new Set(storedBookmarks);
    }
    fetchBookmarkedStories();
});

// Format tanggal agar lebih mudah dibaca
const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

// onMounted(fetchBookmarkedStories);

// Modal dan navigasi gambar
const handleOpenModal = (index) => {
    currentIndex.value = index;
    isModalOpen.value = true;
};
const handleCloseModal = () => (isModalOpen.value = false);
const prevImage = () => (currentIndex.value = (currentIndex.value - 1 + props.storiesId.content_images.length) % props.storiesId.content_images.length);
const nextImage = () => (currentIndex.value = (currentIndex.value + 1) % props.storiesId.content_images.length);
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <Header />

        <!-- Breadcrumb -->
        <nav class="bg-[#F0F5ED] py-6">
            <div class="container mx-auto text-sm text-[#466543] pl-12">
                <NuxtLink to="/" class="relative inline-block group">
                    Home
                    <span
                        class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"></span>
                </NuxtLink>
                <span class="mx-2">/</span>
                <div class="relative inline-block group">Detail</div>
                <span class="mx-2">/</span>
                <NuxtLink to="#" class="relative inline-block group">
                    {{ storiesId.title }}
                    <span
                        class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"></span>
                </NuxtLink>
            </div>
        </nav>

        <div class="relative">
            <button @click="toggleBookmark(storiesId.id)"
                class="absolute top-5 right-14 w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-300"
                :class="isBookmarked ? 'bg-[#1C1C1C]' : 'bg-green-800 hover:bg-[#3B4F3A]'">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                    <transition name="fade-scale" mode="out-in">
                        <path v-if="isBookmarked" key="bookmarked" fill="white"
                            d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.768q.691 0 1.153.463t.463 1.153V19.5l-6-2.577z" />
                        <g v-else key="not-bookmarked">
                            <path fill="white"
                                d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
                        </g>
                    </transition>
                </svg>
            </button>
        </div>

        <!-- Konten Utama -->
        <main class="container mx-auto px-4 py-8">
            <div class="text-center">
                <!-- Tanggal -->
                <p class="text-[#4B4B4B] mb-6">{{ formatDate(storiesId.created_at) || 'Date' }}</p>
                <!-- Judul -->
                <h1 class="text-4xl font-bold text-gray-800 mb-8">{{ storiesId.title }}</h1>
                <!-- Penulis -->
                <div class="flex justify-center items-center space-x-2 text-[#222222]">
                    <img :src="storiesId?.user?.profile_image" alt="Avatar" class="w-8 h-8 rounded-full" />
                    <span class="font-medium">{{ storiesId?.user?.name }}</span>
                </div>
            </div>
        </main>

        <!-- Bagian Gambar dan Konten Teks -->
        <div class="ml-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Bagian Gambar -->
            <div class="relative w-full rounded-lg overflow-hidden">
                <!-- Tampilkan hanya gambar pertama (gambar utama) -->
                <div v-for="(image, index) in storiesId.content_images" :key="index">
                    <div v-if="index === 0">
                        <img :src="image.url" alt="Main Image"
                            class="rounded-lg transition-all duration-200 cursor-pointer" @click="handleOpenModal(0)" />
                    </div>
                </div>
                <!-- Tombol Navigasi Gambar -->
                <button @click="prevImage"
                    class="absolute left-4 top-[30%] transform -translate-y-1/2 bg-transparent rounded-full p-1"
                    aria-label="Previous">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button @click="nextImage"
                    class="absolute right-4 top-[30%] transform -translate-y-1/2 bg-transparent text-white rounded-full p-1"
                    aria-label="Next">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <!-- Bagian Thumbnail -->
                <div class="flex w-full overflow-x-auto gap-3 py-2 scrollbar-hide">
                    <div class="flex flex-nowrap gap-4">
                        <img v-for="(image, index) in storiesId.content_images" :key="index" :src="image.url"
                            alt="Thumbnail"
                            :class="['w-36 h-36 bg-cover bg-center rounded-lg border-2 border-gray-300 cursor-pointer', { 'opacity-70': index !== 0 }]"
                            @click="handleOpenModal(index)" />
                    </div>
                </div>

                <!-- Modal untuk Tampilan Gambar -->
                <div v-if="isModalOpen"
                    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
                    @click.self="handleCloseModal">
                    <div class="relative bg-white p-10 rounded-lg shadow-lg max-w-3xl w-full max-w-[50%]">
                        <!-- Tombol Close -->
                        <button
                            class="absolute top-4 right-2 bg-[#466543] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#3B4F3A]"
                            @click="handleCloseModal">✕</button>
                        <!-- Gambar di Modal -->
                        <div class="relative w-full flex justify-center items-center">
                            <img :src="storiesId.content_images[currentIndex]?.url" alt="Main Image"
                                class="w-full max-h-[350px] object-cover rounded-lg" />
                            <!-- Navigasi di Modal -->
                            <button @click="prevImage" class="absolute left-4 text-white rounded-full p-2"
                                aria-label="Previous">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-300" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button @click="nextImage" class="absolute right-4 text-white rounded-full p-2"
                                aria-label="Next">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <!-- Thumbnail di Modal -->
                        <div class="flex justify-center items-center w-full gap-12 py-2 mt-4 flex-wrap">
                            <img v-for="(image, index) in storiesId.content_images" :key="index" :src="image.url"
                                alt="Thumbnail" :class="[
                                    'w-48 h-48 bg-cover bg-center rounded-lg border-2 border-gray-300 cursor-pointer smooth-transition',
                                    { 'active': currentIndex === index, 'inactive': currentIndex !== index }
                                ]" @click="currentIndex = index" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bagian Konten Teks -->
            <div class="col-span-2 px-6 rounded-lg">
                <div class="text-gray-800 leading-7" v-html="storiesId.content"></div>
                <!-- {{ storiesId.content }} -->
            </div>
        </div>

        <SimilarStories :currentStory="storiesId" />
    </div>

    <!-- Footer -->
    <div
        class="mt-8 border-t border-gray-300 pt-4 text-gray-600 text-sm flex justify-between items-center px-4 sm:px-4">
        <div class="ml-8 h-10">
            <p>© 2024 PT. Timedoor Indonesia. All rights reserved.</p>
        </div>
        <div class="flex space-x-4" style="margin-right: 2rem;">
            <!-- Facebook -->
            <a href="#" target="_blank" class="social-icon">
                <div class="icon-container-facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="70" viewBox="0 0 70 70" fill="white"
                        class="facebook-icon">
                        <rect width="70" height="70" rx="10" ry="10" fill="black" />
                        <path
                            d="M39 21h-6c-2 0-4 2-4 4v5h-5v8h5v19h9V38h6l1-8h-7v-4c0-1 1-2 2-2h5v-8h-6c-6 0-10 4-10 10v4h-5v8h5v19h9V38h6l1-8h-7v-5c0-1 1-2 2-2h5v-8z"
                            fill="white" />
                    </svg>
                </div>
            </a>

            <!-- Instagram -->
            <a href="https://www.instagram.com/ayudwiipa" target="_blank" class="social-icon">
                <div class="icon-container-instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="47" viewBox="0 0 24 24"
                        class="instagram-icon">
                        <rect width="24" height="24" rx="5" ry="5" fill="black" />
                        <circle cx="12" cy="12" r="5" stroke="white" stroke-width="2" fill="none" />
                        <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                    </svg>
                </div>
            </a>

            <!-- YouTube -->
            <a href="#" target="_blank" class="social-icon">
                <div class="icon-container-youtube">
                    <svg xmlns="http://www.w3.org/2000/svg" width="74" height="54" viewBox="0 0 74 54" fill="white"
                        class="youtube-icon">
                        <rect width="74" height="54" rx="12" ry="12" fill="black" />
                        <polygon points="28,16 50,27 28,38" fill="white" />
                    </svg>
                </div>
            </a>
        </div>
    </div>
</template>

<style scoped>
.icon-container-facebook {
    @apply w-8 h-8 flex items-center justify-center bg-black rounded-lg;
}

.icon-container-facebook {
    @apply w-8 h-8 flex items-center justify-center bg-black rounded-lg;
    transition: background 0.3s ease, transform 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
}

.icon-container-facebook:hover {
    background-color: #3B4F3A;
    transform: scale(1.1);
}

.icon-container-facebook:hover .facebook-icon rect {
    fill: #3B4F3A;
}

.icon-container-instagram {
    @apply w-8 h-8 flex items-center justify-center bg-black rounded-lg;
    transition: background 0.3s ease, transform 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
}

.icon-container-instagram:hover {
    background-color: #3B4F3A;
    transform: scale(1.1);
}

.icon-container-instagram:hover .instagram-icon rect {
    fill: #3B4F3A;
}

.icon-container-youtube {
    @apply w-10 h-8 flex items-center justify-center bg-black rounded-lg;
}

.icon-container-youtube:hover {
    background-color: #3B4F3A;
    transform: scale(1.1);
}

.icon-container-youtube:hover .youtube-icon rect {
    fill: #3B4F3A;
}

.social-icon {
    @apply transition-transform transform hover:scale-110;
}

.smooth-transition {
    transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out;
}

.smooth-transition.active {
    opacity: 1;
    transform: scale(1.05);
}

.smooth-transition.inactive {
    opacity: 0.7;
    transform: scale(1);
}
</style>
