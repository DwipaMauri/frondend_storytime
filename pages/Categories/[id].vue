<script setup>
// API Integration
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

const route = useRoute();
const categoryName = route.params.id; // Category from route

// Reactive State
const searchQuery = ref("");
const selectedSort = ref("newest");
const selectedCategory = ref(categoryName); // Initialize with route category
const stories = ref([]);

// Fetch Stories
const fetchStories = async () => {
  try {
    const response = await $fetch(`${apiUrl}/api/stories`, {
      method: 'GET',
      params: {
        category: selectedCategory.value,
        search: searchQuery.value,
        sort_by: selectedSort.value === "newest" ? "created_at" : "title",
        sort_order: selectedSort.value === "z-a" ? "desc" : "asc",
      }
    });
    stories.value = response.data || [];
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
};

// Watch Filters for Changes
watch([searchQuery, selectedSort, selectedCategory], fetchStories);

// Handle Category Change
const onCategoryChange = () => {
  window.location.href = `/Categories/${selectedCategory.value}`;
};

// Initial Fetch
onMounted(async () => {
  await fetchStories();
});
</script>

<template>
  <Header />

  <!-- Category Header -->
  <div class="mb-12 mt-10">
    <h1 v-if="selectedCategory" class="text-3xl font-serif font-bold text-gray-800 ml-12 mb-6">
      {{ selectedCategory }}
    </h1>
    <h1 v-else class="text-3xl font-serif font-bold text-gray-800 ml-12 mb-6">Category
      All Stories
    </h1>
    <div class="bg-[#F0F5ED] px-12 py-6">
      <nav class="text-sm text-[#466543] flex items-center">
        <NuxtLink to="/" class="relative inline-block group">
          Home
          <span
            class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"
          ></span>
        </NuxtLink>
        <span class="mx-2">/</span>
        <div class="relative inline-block group cursor-default">Category</div>
        <span class="mx-2">/</span>
        <NuxtLink to="#" class="relative inline-block group">
          {{ selectedCategory }}
          <span
            class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"
          ></span>
        </NuxtLink>
      </nav>
    </div>
  </div>

  <!-- Filters -->
  <div
    class="flex flex-col lg:flex-row items-start lg:items-center justify-between rounded-md"
  >
    <div class="flex flex-wrap gap-4">
      <div class="flex flex-wrap gap-8 ml-12">
        <!-- Sort By -->
        <div class="flex items-center space-x-2">
          <div class="text-gray-500 text-base font-medium">Sort by</div>
          <select
            v-model="selectedSort"
            class="text-black focus:outline-none focus:ring-0 cursor-pointer hover:text-[#466543]"
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div>

        <!-- Category -->
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 text-base font-medium">Category</span>
          <select
            v-model="selectedCategory"
            @change="onCategoryChange"
            class="text-black text-base font-medium focus:outline-none focus:ring-0 cursor-pointer hover:text-[#466543]"
          >
            <option value="Comedy">Comedy</option>
            <option value="Romance">Romance</option>
            <option value="Horror">Horror</option>
            <option value="Adventure">Adventure</option>
            <option value="Fiction">Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Drama">Drama</option>
            <option value="Heartfelt">Heartfelt</option>
            <option value="Mystery">Mystery</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="mt-4">
      <div
        class="flex items-center bg-white border border-gray-300 rounded-md px-6 py-5 lg:w-[400px] mr-20"
      >
        <input
          v-model="searchQuery"
          placeholder="Search story"
          class="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none cursor-text"
        />
        <button class="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Stories Grid -->
  <div class="grid grid-cols-3 gap-6 p-10">
    <div
      v-for="story in stories"
      :key="story.id"
      class="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
    >
      <img
        :src="story.first_image"
        alt="Story Image"
        class="w-full h-40 object-cover"
      />
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">{{ story.title }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ story.preview_content }}</p>
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>{{ story.user }}</span>
          <span>{{ story.created_at }}</span>
        </div>
      </div>
    </div>
  </div>
</template>