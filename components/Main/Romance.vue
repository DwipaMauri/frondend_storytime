<script setup>
const props = defineProps({
    stories: {
        type: Array,
        required: true
    }
});

// Function to format the date
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-20">
        <div v-for="(story, index) in stories.splice(0, 3)" :key="index" class="flex flex-col gap-8">
            <!-- Card 1: -->
            <div class="rounded-lg overflow-hidden group">
                <div class="relative inline-block">
                    <!-- Gambar -->
                    <NuxtLink :to="`/detail/${story.id}`">
                        <img src="https://inspiredluv.com/wp-content/uploads/2016/09/2-Beijing.jpg" alt="image" class="w-full h-64 md:h-[400px] object-cover group-hover:opacity-75 transition-opacity duration-300" />
                    </NuxtLink>

                    <!-- Ikon Bookmark di kanan -->
                    <div
                        class="absolute bottom-5 right-5 bg-[#4C6248] w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v16l7-5 7 5V3z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 9h4m-2-2v4" />
                        </svg>
                    </div>
                </div>

                <div class="p-1">
                    <h3 class="text-lg font-bold text-black">{{ story.title }}</h3>
                    <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                        {{ story.preview_content }}
                    </p>
                    <div class="flex items-center justify-between mt-4 text-sm">
                        <div class="flex items-center gap-2">
                            <img src="public/img/Ellipse 66 (1).png" alt="Ellipse 66 (1)"
                                class="w-8 h-8 rounded-full" />
                            <span class="text-gray-800 font-medium">{{ story.user }}</span>
                        </div>
                        <div>
                            <span class="text-gray-500 mt-8">{{ formatDate(story.created_at) }}</span>
                            <span class="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-md">
                                {{ story.category }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>