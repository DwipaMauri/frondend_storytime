<script setup>
import { onMounted, ref } from 'vue';

// Props for receiving story data
const props = defineProps({
    storiesId: {
        type: Array,
        required: true,
    },
});

// Dynamic array of images for the story
const images = ref([]);

// Modal and image handling
const isModalOpen = ref(false);
const currentIndex = ref(0); // Inisialisasi currentIndex dengan 0

// Open the modal and set the clicked image index
const handleOpenModal = (index) => {
    currentIndex.value = index;
    isModalOpen.value = true;
};

// Close the modal
const handleCloseModal = () => {
    isModalOpen.value = false;
};

// Navigate to the previous image
const prevImage = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--; // Kurangi indeks jika tidak berada di gambar pertama
    }
    // Tidak ada else, sehingga tidak bisa kembali ke gambar terakhir
};

// Navigate to the next image
const nextImage = () => {
    if (currentIndex.value < props.storiesId.content_images.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0; // Loop kembali ke gambar pertama
    }
};

onMounted(() => {
    if (props.storiesId?.content_images) {
        images.value = props.storiesId.content_images
    }
});

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
    <div class="min-h-screen bg-gray-50">
        <Header />

        <!-- Breadcrumb -->
        <nav class="bg-[#F0F5ED] py-6">
            <div class="container mx-auto text-sm text-[#466543] ml-12">
                <NuxtLink to="/" class="relative inline-block group">
                    Home
                    <span
                        class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"></span>
                </NuxtLink>
                <span class="mx-2">/</span>
                <div to="/" class="relative inline-block group">
                    Detail
                </div>
                <span class="mx-2">/</span>
                <NuxtLink to="#" class="relative inline-block group">
                    {{ storiesId.title }}
                    <span
                        class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"></span>
                </nuxtLink>
            </div>
        </nav>

        <!-- Content -->
        <main class="container mx-auto px-4 py-8">
            <div class="text-center">
                <!-- Tanggal -->
                <p class="text-[#4B4B4B] text-[Quartz] mb-6">{{ formatDate(storiesId.created_at) || 'Date' }}</p>
                <!-- Judul -->
                <h1 class="text-4xl font-bold text-[Raisin Black] mb-8">
                    {{ storiesId.title }}
                </h1>
                <!-- Penulis -->
                <div class="flex justify-center items-center space-x-2 text-[#222222]">
                    <img src="public/img/Ellipse 66 (4).png" alt="Author" class="w-6 h-6 rounded-full" />
                    <span class="font-medium">{{ storiesId?.user?.name }}</span>
                </div>
            </div>
        </main>

        <!-- Main Content -->
        <div class="ml-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Image Section -->
            <div class="relative w-full rounded-lg overflow-hidden">
                <div v-for="(image, index) in storiesId.content_images" :key="index">
                    <!-- GAMBAR UTAMA (Hanya yang pertama) -->
                    <div v-if="index === 0">
                        <img :src="image.url" alt="Main Image"
                            class="rounded-lg shrink-0 transition-all duration-200" @click="handleOpenModal(0)" />
                    </div>
                </div>
                <!-- Tombol Panah Kiri -->
                <button @click="prevImage"
                    class="absolute left-4 top-[35%] transform -translate-y-1/2 bg-transparent rounded-full p-1"
                    aria-label="Previous">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <!-- Tombol Panah Kanan -->
                <button @click="nextImage"
                    class="absolute right-4 top-[35%] transform -translate-y-1/2 bg-transparent text-white rounded-full p-1"
                    aria-label="Next">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <!-- THUMBNAIL SECTION (1 Baris) -->
                <div class="flex w-full overflow-x-auto gap-3 py-2 scrollbar-hide">
                    <div class="flex flex-nowrap gap-4">
                        <img v-for="(image, index) in storiesId.content_images" :key="index"
                            :src="image.url" alt="Thumbnail" :class="[
                                'w-36 h-36 bg-cover bg-center rounded-lg border-2 border-gray-300 cursor-pointer',
                                { 'opacity-70': index !== 0 }]" @click="handleOpenModal(index)" />
                    </div>
                </div>

                <!-- MODAL -->
                <div v-if="isModalOpen"
                    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
                    @click.self="handleCloseModal">
                    <div class="relative bg-white p-10 rounded-lg shadow-lg max-w-3xl w-full max-w-[50%]">
                        <!-- CLOSE BUTTON -->
                        <button
                            class="absolute top-4 right-2 bg-[#466543] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#3B4F3A]"
                            @click="handleCloseModal">✕</button>

                        <!-- Image Container -->
                        <div class="relative w-full flex justify-center items-center">
                            <!-- Modal Image (Dynamic image) -->
                            <img :src="storiesId.content_images[currentIndex]?.url"
                                alt="Main Image" class="w-full max-h-[350px] object-cover rounded-lg" />

                            <!-- Navigation Arrows -->
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

                        <!-- Thumbnails -->
                        <div class="flex justify-center items-center w-full gap-12 py-2 mt-4 flex-wrap">
                            <img v-for="(image, index) in storiesId.content_images" :key="index"
                                :src="image.url" alt="Thumbnail" :class="[
                                    'w-48 h-48 bg-cover bg-center rounded-lg border-2 border-gray-300 cursor-pointer smooth-transition',
                                    { 'active': currentIndex === index, 'inactive': currentIndex !== index }
                                ]" @click="currentIndex = index" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Text Content -->
            <div class="col-span-2 px-6 rounded-lg">
                <div class="text-gray-800 leading-7">
                    {{ storiesId.content }}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 border-t border-gray-300 pt-4 text-gray-600 text-sm flex justify-between items-center">
            <div class="ml-20">
                <p>© 2024 PT. Timedoor Indonesia. All rights reserved.</p>
            </div>
            <div class="flex space-x-4" style="margin-right: 50px">
                <div>
                    <img src="public/img/Icon Social Media.png" alt="Facebook" class="w-6 h-6" />
                </div>
                <div>
                    <img src="public/img/Icon Social Media (1).png" alt="Instagram" class="w-6 h-6" />
                </div>
                <div>
                    <img src="public/img/Icon Social Media (2).png" alt="YouTube" class="w-8 h-6" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.smooth-transition {
    transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out;
}

.smooth-transition.active {
    opacity: 1;
    transform: scale(1.05);
    /* Slight zoom-in effect for emphasis */
}

.smooth-transition.inactive {
    opacity: 0.7;
    transform: scale(1);
}
</style>
