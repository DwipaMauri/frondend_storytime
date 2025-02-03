<script setup>
const props = defineProps({
    stories: {
        type: Array,
        required: true
    }
});

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

// API Call untuk konfigurasi runtime
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// Fungsi untuk mendapatkan URL gambar atau ikon default
const userIconSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/></svg>`;

const getImageUrl = (image) => {
    const imagePath = image && typeof image === 'object' ? image.url : '';
    if (imagePath && !imagePath.startsWith('http')) {
        return `${apiUrl}/storage/${imagePath}`;
    }
    return imagePath || userIconSvg;
};
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 px-12">
        <!-- Looping dataRomance untuk menampilkan gambar -->
        <div v-for="(story, index) in stories.splice(0, 3)" :key="index" class="rounded-lg overflow-hidden group">
            <div class="relative">
                <!-- Gambar dari cerita -->
                <NuxtLink :to="`/detail/${story.id}`">
                    <img :src="getImageUrl(story.content_images[0])" :alt="story.title"
                        class="w-full h-64 md:h-[400px] min-w-[420px] max-w-[500px] object-cover group-hover:opacity-75 transition-opacity duration-300" />
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

            <!-- Informasi cerita -->
            <div class="mt-2">
                <h3 class="text-lg font-bold text-black">{{ story.title }}</h3>
                <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                    {{ story.preview_content }}
                </p>
                <div class="flex items-center justify-between mt-4 text-sm">
                    <div class="flex items-center gap-2">
                        <img src="public/img/Ellipse 66 (1).png" alt="Ellipse 66 (1)" class="w-8 h-8 rounded-full" />
                        <span class="text-gray-800 font-medium">{{ story.user.name }}</span>
                    </div>
                    <div>
                        <span class="text-gray-500 mt-8">{{ formatDate(story.created_at) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>