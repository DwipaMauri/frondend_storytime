<script setup>
// API Call diambil dari runtime config
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
// console.log(apiUrl);

//Data yang sudah didapat dari API disimpan dalam variabel reaktif
const stories = ref([]);
const userName = ref('');

// Fetch stories function
const fetchStories = async () => {
  console.log('Attempting to fetch from URL:', `${apiUrl}/api/stories`);
  try {
    const response = await $fetch(`${apiUrl}/api/stories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    stories.value = response?.data || [];
    // console.log("Fetched stories:", stories.value); // Debug log
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
};

onMounted(async () => {
  // Fetch stories dari API
  await fetchStories();

  // Ambil data user dari cookie
  const storedUser = useCookie('user').value;
  //Jika cookie user ditemukan maka userName akan diperbarui 
  if (storedUser) {
    userName.value = storedUser.name;
  }
});

// Computed properties for filtered stories berdasarkan kategori
const comedyStories = computed(() => {
  return stories.value ? stories.value.filter(story => story.category.name === 'Comedy') : [];
});
const romanceStories = computed(() => {
  return stories.value ? stories.value.filter(story => story.category.name === 'Romance') : [];
});
const horrorStories = computed(() => {
  return stories.value ? stories.value.filter(story => story.category.name === 'Horror') : [];
});

// Reactive search query
const searchQuery = ref("")

// Use router for programmatic navigation
const router = useRouter()

// Handle the search when Enter key is pressed (Jika pengguna menekan Enter, fungsi handleSearch dijalankan)
const handleSearch = () => {
  if (searchQuery.value.trim() !== "") {
    router.push({ path: '/AllStories', query: { Search: searchQuery.value } }) //Saat halaman AllStories dimuat, aplikasi akan membaca parameter search dari URL
  } else {
    router.push('/AllStories')
  }
}
</script>

<template>
  <!-- Header -->
  <Header />

  <!-- Main Content -->
  <div class="text-center mt-12 px-4">
    <!-- Heading -->
    <p v-if="userName"
      class="text-4xl sm:text-3xl md:text-4xl font-bold mb-4 text-black drop-shadow-lg font-serif text-center">
      Hi, {{ userName }}!
    </p>

    <h2 class="text-4xl sm:text-3xl md:text-4xl font-bold mb-4 text-black drop-shadow-lg font-serif text-center">Welcome
      to Storytime</h2>

    <!-- Description -->
    <p class="text-gray-700 text-lg mb-8 max-w-5xl mx-auto leading-relaxed font-serif text-center">
      The world's most-loved social storytelling platform. Story time connects a
      global community of 90 million readers and writers through the power of
      story.
    </p>

    <!-- Search Bar -->
    <div class="flex justify-center items-center mb-12">
      <!-- Search bar container -->
      <div class="relative w-full sm:max-w-xl max-w-full">
        <!-- Search input -->
        <input type="text" v-model="searchQuery" placeholder="Search story"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10"
          aria-label="Search stories" @keyup.enter="handleSearch" />

        <!-- Search icon -->
        <NuxtLink :to="{ path: '/AllStories', query: { Search: searchQuery } }"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 rounded-r-md text-gray-500"
          aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
            <path fill-rule="evenodd"
              d="M10.5 3a7.5 7.5 0 0 1 5.898 12.151l4.775 4.774a1 1 0 0 1-1.414 1.414l-4.774-4.775A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
              clip-rule="evenodd" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Illustration -->
    <div class="flex justify-center">
      <img src="/img/image 14.png" alt="Illustration"
        class="w-full max-w-2xl h-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl" />
    </div>
  </div>

  <!-- Latest Story -->
  <div class="px-4 sm:px-8 py-8 mt-16">
    <div class="flex items-center justify-between mb-6 px-4 sm:px-8">
      <h2 class="text-3xl sm:text-4xl font-serif font-bold text-raisin-black mb-0">
        Latest Story
      </h2>
      <NuxtLink to="/allstories" class="relative flex items-center cursor-pointer text-gray-400 group">
        <span class="text-[15px] group-hover:text-[#466543] transition duration-300
        after:content-[''] after:block after:w-full after:h-[1px] 
        after:bg-current after:scale-0 hover:after:scale-100 
        after:transition-transform after:duration-300">
          Explore More
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"
          class="w-4 h-4 ml-1 group-hover:text-[#466543] transition duration-300">
          <path d="M4 12h16"></path>
          <path d="M14 6l6 6-6 6"></path>
        </svg>
      </NuxtLink>
    </div>

    <!-- Line Separator -->
    <div class="border-b border-gray-300 my-2 mx-4 sm:mx-8"></div>
    <!-- Story Card Latest Story -->
    <div class="px-4 py-4">
      <LatestStory :stories="stories" />
    </div>
  </div>

  <!-- Comedy Category -->
  <div class="px-4 py-8">
    <div class="px-4 sm:px-8 mt-6">
      <div class="flex items-center justify-between">
        <h3 class="text-3xl sm:text-4xl font-serif font-bold text-raisin-black">
          Comedy
        </h3>
        <NuxtLink to="/Categories/Comedy" class="relative flex items-center cursor-pointer text-gray-400 group">
          <span class="text-[15px] group-hover:text-[#466543] transition duration-300
          after:content-[''] after:block after:w-full after:h-[1px] 
          after:bg-current after:scale-0 hover:after:scale-100 
          after:transition-transform after:duration-300">
            Explore More
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            class="w-4 h-4 ml-1 group-hover:text-[#466543] transition duration-300">
            <path d="M4 12h16"></path>
            <path d="M14 6l6 6-6 6"></path>
          </svg>
        </NuxtLink>
      </div>

      <!-- Border -->
      <div class="border-b border-gray-300 mt-6 mx-4 sm:mx-0"></div>
    </div>
    <!-- Story Comedy -->
    <MainComedy :stories="comedyStories" />
  </div>

  <!-- Romance Category -->
  <div>
    <div class="py-2">
      <div class="flex items-center justify-between px-4 sm:px-14">
        <h3 class="text-3xl sm:text-4xl font-serif font-bold text-raisin-black">
          Romance
        </h3>
        <NuxtLink to="/Categories/Romance" class="relative flex items-center cursor-pointer text-gray-400 group">
          <span
            class="text-[15px] group-hover:text-[#466543] transition duration-300 after:content-[''] after:block after:w-full after:h-[1px] after:bg-current after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300">
            Explore More
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            class="w-4 h-4 ml-1 group-hover:text-[#466543] transition duration-300">
            <path d="M4 12h16"></path>
            <path d="M14 6l6 6-6 6"></path>
          </svg>
        </NuxtLink>
      </div>
    </div>
    <!-- Border -->
    <div class="px-4 sm:px-12">
      <div class="border-b border-gray-300 my-8"></div>
    </div>
    <!-- Card Romance -->
    <MainRomance :stories="romanceStories" />
  </div>

  <!-- Story Horror -->
  <div class="py-8">
    <div class="px-4 sm:px-12 mt-8">
      <div class="flex items-center justify-between">
        <h3 class="text-3xl sm:text-4xl font-serif font-bold text-raisin-black">
          Horror
        </h3>
        <NuxtLink to="/Categories/Horror" class="relative flex items-center cursor-pointer text-gray-400 group">
          <span
            class="text-[15px] group-hover:text-[#466543] transition duration-300 after:content-[''] after:block after:w-full after:h-[1px] after:bg-current after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300">
            Explore More
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            class="w-4 h-4 ml-1 group-hover:text-[#466543] transition duration-300">
            <path d="M4 12h16"></path>
            <path d="M14 6l6 6-6 6"></path>
          </svg>
        </NuxtLink>
      </div>

      <!-- Border -->
      <div class="border-b border-gray-300 w-full mt-8"></div>
    </div>
    <!-- Story Horror -->
    <MainHorror :stories="horrorStories" />
  </div>

  <div class="bg-white">
    <!-- Judul -->
    <h2 class="text-2xl font-semibold mb-6 mx-12 sm:ml-12">More Categories</h2>
    <hr class="border-t border-gray-200 mb-8 mx-12 sm:ml-12" />

    <!-- Grid Kategori -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 mx-4 sm:mx-12">
      <NuxtLink to="/Categories/Mystery"
        class="bg-[#F0F5ED] hover:bg-[#DCEEDD] text-center text-[#466543] hover:text-black py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40">
        Mystery
      </NuxtLink>

      <NuxtLink to="/Categories/Adventure"
        class="bg-[#F0F5ED] hover:bg-[#DCEEDD] text-center text-[#466543] hover:text-black py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40">
        Adventure
      </NuxtLink>

      <NuxtLink to="/Categories/Fiction"
        class="bg-[#F0F5ED] hover:bg-[#DCEEDD] text-center text-[#466543] hover:text-black py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40">
        Fiction
      </NuxtLink>

      <NuxtLink to="/Categories/Fantasy"
        class="bg-[#F0F5ED] hover:bg-[#DCEEDD] text-center text-[#466543] hover:text-black py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40">
        Fantasy
      </NuxtLink>

      <NuxtLink to="/Categories/Drama"
        class="bg-[#F0F5ED] hover:bg-[#DCEEDD] text-center text-[#466543] hover:text-black py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40">
        Drama
      </NuxtLink>

      <NuxtLink to="/Categories/Heartfelt"
        class="bg-[#F0F5ED] hover:bg-[#DCEEDD] text-center text-[#466543] hover:text-black py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40">
        Heartfelt
      </NuxtLink>
    </div>
  </div>

  <!-- Footer -->
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