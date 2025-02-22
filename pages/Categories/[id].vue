<script setup>
// API Integration
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

const route = useRoute();
const categoryName = route.params.id;

// Reactive State
const searchQuery = ref("");
const selectedSort = ref("newest");
const selectedCategory = ref(categoryName);
const stories = ref([]);
const bookmarkedStories = ref(new Set());

const currentPage = ref(1);
const totalPages = ref(1);
const perPage = 6;

// Fetch Stories
const fetchStories = async () => {
  try {
    const params = {
      category: selectedCategory.value, search: searchQuery.value, sort_by: selectedSort.value, page: currentPage.value,
      per_page: perPage,
    };
    const response = await $fetch(`${apiUrl}/api/stories`, { method: 'GET', params });
    stories.value = response.data || [];
    totalPages.value = response.meta?.last_page || 1;
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchStories();
  }
};

// Watch Filters for Changes
watch([searchQuery, selectedSort, selectedCategory], fetchStories);

// Handle Category Change
const onCategoryChange = () => {
  window.location.href = `/Categories/${selectedCategory.value}`;
};

// Toggle Bookmark
const toggleBookmark = (storyId) => {
  if (bookmarkedStories.value.has(storyId)) {
    bookmarkedStories.value.delete(storyId);
  } else {
    bookmarkedStories.value.add(storyId);
  }
  localStorage.setItem("bookmarkedStories", JSON.stringify([...bookmarkedStories.value]));
};

// Retrieve Bookmarks from Local Storage
onMounted(() => {
  const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedStories")) || [];
  bookmarkedStories.value = new Set(savedBookmarks);
  fetchStories();
});

const getImageUrl = (image) => {
  const imagePath = image && typeof image === 'object' ? image.url : '';
  return imagePath && !imagePath.startsWith('http') ? `${apiUrl}/storage/${imagePath}` : imagePath;
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};
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
            class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"></span>
        </NuxtLink>
        <span class="mx-2">/</span>
        <div class="relative inline-block group cursor-default">Category</div>
        <span class="mx-2">/</span>
        <NuxtLink to="#" class="relative inline-block group">
          {{ selectedCategory }}
          <span
            class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"></span>
        </NuxtLink>
      </nav>
    </div>
  </div>

  <!-- Filters -->
  <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between rounded-md">
    <div class="flex flex-wrap gap-4">
      <div class="flex flex-wrap gap-8 ml-12">
        <!-- Sort By -->
        <div class="flex items-center space-x-2">
          <div class="text-gray-500 text-base font-medium">Sort by</div>
          <select v-model="selectedSort"
            class="text-black focus:outline-none focus:ring-0 cursor-pointer hover:text-[#466543]">
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div>

        <!-- Category -->
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 text-base font-medium">Category</span>
          <select v-model="selectedCategory" @change="onCategoryChange"
            class="text-black text-base font-medium focus:outline-none focus:ring-0 cursor-pointer hover:text-[#466543]">
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
      <div class="relative flex items-center bg-white rounded-md lg:w-[400px] mr-12">
        <input v-model="searchQuery" placeholder="Search story"
          class="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none px-6 py-5 cursor-text border border-gray-300 rounded-md pr-12" />
        <button class="absolute right-6 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Stories Grid -->
  <div class="grid grid-cols-3 gap-6 p-10">
    <div v-for="story in stories" :key="story.id" class="rounded-lg overflow-hidden transition relative group">
      <nuxt-link :to="`/detail/${story.id}`">
        <img :src="getImageUrl(story.content_images[0])" alt="Story Image"
          class="w-full h-96 object-cover transition-opacity duration-300 rounded-t-lg group-hover:opacity-75" />
      </nuxt-link>

      <!-- Toggle Bookmark Button -->
      <button @click="toggleBookmark(story.id)"
        class="absolute bottom-48 right-8 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-300 shadow-md"
        :class="bookmarkedStories.has(story.id) ? 'bg-[#1C1C1C]' : 'bg-green-800 hover:bg-[#3B4F3A]'">
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
          <transition name="fade-scale" mode="out-in">
            <path v-if="bookmarkedStories.has(story.id)" key="bookmarked" fill="white"
              d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.768q.691 0 1.153.463t.463 1.153V19.5l-6-2.577z" />
            <g v-else key="not-bookmarked">
              <path fill="white"
                d="M6 19.5V5.616q0-.691.463-1.153T7.616 4H13v1H7.616q-.231 0-.424.192T7 5.616V17.95l5-2.15l5 2.15V11h1v8.5l-6-2.577zM7 5h6zm10 4V7h-2V6h2V4h1v2h2v1h-2v2z" />
            </g>
          </transition>
        </svg>
      </button>

      <div class="mt-2">
        <h3 class="text-lg font-semibold mb-2">{{ story.title }}</h3>
        <p class="text-sm text-gray-600 leading-relaxed line-clamp-3" v-html="story.preview_content"></p>
        <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <img :src="story.user.profile_image" alt="Avatar" class="w-8 h-8 rounded-full" />
            <span class="font-medium truncate">{{ story.user.name }}</span>
          </div>
          <span>{{ formatDate(story.created_at) || 'Date' }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Pagination Controls -->
  <div class="flex justify-center mt-8 space-x-2">
    <!-- Tombol "Prev" hanya muncul jika currentPage > 1 -->
    <button v-if="currentPage > 1" @click="changePage(currentPage - 1)"
      class="px-4 py-2 bg-[#F0F5ED] text-black hover:text-white hover:bg-lime-900 rounded">
      Prev
    </button>

    <!-- Nomor halaman -->
    <button v-for="page in totalPages" :key="page" @click="changePage(page)" class="px-4 py-2 rounded transition-all"
      :class="{
        'bg-[#466543] hover:bg-[#3B4F3A] text-white font-bold': currentPage === page,
        'bg-[#F0F5ED] text-black hover:text-white hover:bg-[#3B4F3A]': currentPage !== page
      }">
      {{ page }}
    </button>

    <!-- Tombol "Next" hanya muncul jika belum di halaman terakhir -->
    <button v-if="currentPage < totalPages" @click="changePage(currentPage + 1)"
      class="px-4 py-2 bg-[#F0F5ED] text-black hover:text-white hover:bg-[#3B4F3A] rounded">
      Next
    </button>
  </div>

  <div class="mt-8 border-t border-gray-300 pt-4 text-gray-600 text-sm flex justify-between items-center px-4 sm:px-4">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="47" viewBox="0 0 24 24" class="instagram-icon">
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
</style>