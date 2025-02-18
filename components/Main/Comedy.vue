<script setup>
const userIconSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M12 4a4 4 0 0 1 4 4a4 4 0 1 1-8 0a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/></svg>`;

// Ambil konfigurasi runtime Nuxt
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

const props = defineProps({ //menerima stories sebagai properti dari parent component atau dari server-side rendering (SSR)
    stories: { //berisi daftar cerita yang ditampilkan di halaman
        type: Array,
        required: true
    }
});

// State untuk menyimpan daftar bookmark lokal
const bookmarkedStories = ref([]);
const token = useCookie('token').value;

const handleBookmarkClick = (storyId) => { //Jika pengguna belum login (token tidak ada)
    if (!token) {
        alert('You need to log in to toggle a bookmark.'); //Jika user tidak mendapatkan token 
        return;
    }
    toggleBookmark(storyId);
};

// Muat bookmarkedStories dari localStorage saat komponen di-mount
onMounted(() => {
    const storedBookmarks = localStorage.getItem('bookmarkedStories');
    if (storedBookmarks) {
        bookmarkedStories.value = JSON.parse(storedBookmarks);
    }
});

const toggleBookmark = async (storyId) => { //Jika pengguna sudah login, fungsi toggleBookmark(storyId) dipanggil
    try {
        const token = useCookie('token').value;
        const response = await $fetch(`${apiUrl}/api/bookmarks/toggle`, { //Jika user memiliki token, mengirim request HTTP POST ke backend menggunakan $fetch
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: { story_id: storyId }
        });

        alert(response.message);

        // Periksa apakah cerita sudah di-bookmark
        if (bookmarkedStories.value.includes(storyId)) {
            bookmarkedStories.value = bookmarkedStories.value.filter(id => id !== storyId);
        } else {
            bookmarkedStories.value.push(storyId);
        }

        // Gunakan nextTick agar perubahan state selesai sebelum disimpan ke localStorage
        await nextTick();
        localStorage.setItem('bookmarkedStories', JSON.stringify(bookmarkedStories.value));
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        alert(error.data?.message || 'An error occurred while toggling bookmark.');
    }
};

// Fungsi untuk mendapatkan URL gambar
const getImageUrl = (image) => { //Jika image.url tidak dimulai dengan http, maka gambar berasal dari penyimpanan backend (storage/)
    const imagePath = image && typeof image === 'object' ? image.url : '';
    if (imagePath && !imagePath.startsWith('http')) {
        return `${apiUrl}/storage/${imagePath}`;
    }
    return imagePath || userIconSvg; //Jika tidak ada gambar, digunakan ikon default userIconSvg
};

// Fungsi untuk memformat tanggal
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            <!-- Card 1: Story Besar -->
            <div v-for="(story) in stories.slice(0, 1)" :key="story.id"
                class="md:col-span-2 rounded-lg overflow-hidden relative group">
                <div class="relative inline-block">
                    <NuxtLink :to="`/detail/${story.id}`">
                        <img :src="getImageUrl(story.content_images[0])" :alt="story.title"
                            class="w-full h-64 md:h-[940px] object-cover group-hover:opacity-75 transition-opacity duration-300" />
                    </NuxtLink>

                    <!-- Tombol Bookmark -->
                    <button @click="toggleBookmark(story.id)"
                        class="absolute bottom-5 right-5 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-300"
                        :class="bookmarkedStories.includes(story.id) ? 'bg-[#1C1C1C]' : 'bg-green-800 hover:bg-[#3B4F3A]'">

                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                            <transition name="fade-scale" mode="out-in">
                                <path v-if="bookmarkedStories.includes(story.id)" key="bookmarked" fill="white"
                                    d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.768q.691 0 1.153.463t.463 1.153V19.5l-6-2.577z" />

                                <g v-else key="not-bookmarked">
                                    <path fill="white"
                                        d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
                                </g>
                            </transition>
                        </svg>
                    </button>
                </div>

                <div>
                    <h3 class="text-lg md:text-2xl font-bold text-black mt-2 truncate transition duration-300 group-hover:text-[#466543]">
                        {{ story.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                        {{ story.preview_content }}
                    </p>
                    <div class="flex items-center justify-between mt-4 text-sm">
                        <div class="flex items-center gap-2">
                            <img :src="story.user.profile_image" alt="Avatar" class="w-8 h-8 rounded-full" />
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
                <div v-for="(story, index) in stories.slice(1, 3)" :key="index"
                    class="rounded-lg overflow-hidden group mb-6">
                    <div class="relative inline-block">
                        <NuxtLink :to="`/detail/${story.id}`">
                            <img :src="getImageUrl(story.content_images[0])" :alt="story.title"
                                class="w-[500px] h-auto max-h-80 object-cover group-hover:opacity-75 transition-opacity duration-300" />
                        </NuxtLink>

                        <!-- Tombol Bookmark -->
                        <button @click="toggleBookmark(story.id)"
                            class="absolute bottom-5 right-5 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-300"
                            :class="bookmarkedStories.includes(story.id) ? 'bg-[#1C1C1C]' : 'bg-green-800 hover:bg-[#3B4F3A]'">

                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                                <transition name="fade-scale" mode="out-in">
                                    <path v-if="bookmarkedStories.includes(story.id)" key="bookmarked" fill="white"
                                        d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.768q.691 0 1.153.463t.463 1.153V19.5l-6-2.577z" />

                                    <g v-else key="not-bookmarked">
                                        <path fill="white"
                                            d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
                                    </g>
                                </transition>
                            </svg>
                        </button>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold text-black mt-2 truncate transition duration-300 group-hover:text-[#466543]">
                            {{ story.title }}</h3>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                            {{ story.preview_content }}
                        </p>
                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center gap-2">
                                <img :src="story.user.profile_image" alt="Avatar" class="w-8 h-8 rounded-full mt-6" />
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