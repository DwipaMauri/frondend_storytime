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
const storyCurrentPage = ref(1);
const storyTotalPages = ref(1);
const storyPerPage = 3;

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
            query: {
                page: storyCurrentPage.value,
                per_page: storyPerPage,
            }
        });

        similarStories.value = response.data || response;
        storyTotalPages.value = response.meta?.last_page || 1;
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

const changePage = (page) => {
    if (page >= 1 && page <= storyTotalPages.value) {
        storyCurrentPage.value = page;
        fetchStories();
    }
};
</script>

<template>
    <div class="mt-28 px-12">
        <h2 class="text-2xl font-bold mb-6 border-b pb-3 border-gray-300">Similar Stories</h2>
        <div v-if="similarStories.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="story in similarStories" :key="story.id" class="transition group">
                <div class="relative">
                    <NuxtLink :to="`/detail/${story.id}`">
                        <img :src="getImageUrl(story.content_images?.[0]?.url)" alt="Story Image"
                            class="w-full h-96 object-cover rounded-t-lg transition-opacity duration-300 group-hover:opacity-75" />
                    </NuxtLink>
                </div>
                <NuxtLink :to="`/detail/${story.id}`">
                    <h4 class="text-xl font-semibold mt-2">{{ story.title }}</h4>
                    <p class="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3" v-html="story.preview_content">
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

        <!-- Pagination Controls -->
        <div class="mt-16 w-full flex justify-center items-center space-x-2">
            <button v-if="storyCurrentPage > 1" @click="changePage(storyCurrentPage - 1)"
                class="px-4 py-2 bg-[#F0F5ED] text-black hover:text-white hover:bg-lime-900 rounded">
                Prev
            </button>

            <!-- Nomor halaman -->
            <button v-for="page in storyTotalPages" :key="page" @click="changePage(page)"
                class="px-4 py-2 rounded transition-all mx-1" :class="{
                    'bg-[#466543] hover:bg-[#3B4F3A] text-white font-bold': storyCurrentPage === page,
                    'bg-[#F0F5ED] text-black hover:text-white hover:bg-[#3B4F3A]': storyCurrentPage !== page
                }">
                {{ page }}
            </button>

            <!-- Tombol "Next" hanya muncul jika belum di halaman terakhir -->
            <button v-if="storyCurrentPage < storyTotalPages" @click="changePage(storyCurrentPage + 1)"
                class="px-4 py-2 bg-[#F0F5ED] text-black hover:bg-[#3B4F3A] hover:text-white rounded">
                Next
            </button>
        </div>
    </div>
</template>
