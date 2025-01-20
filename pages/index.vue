<script setup>
// API Call
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;
console.log(apiUrl);

const stories = ref([]);

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
    console.log("Fetched stories:", stories.value); // Debug log
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
};

// Fetch stories on component mount
onMounted(async () => {
  await fetchStories();
});

// Computed properties for filtered stories
const comedyStories = computed(() => {
  return stories.value ? stories.value.filter(story => story.category === 'Comedy') : [];
});
const romanceStories = computed(() => {
  return stories.value ? stories.value.filter(story => story.category === 'Romance') : [];
});
const horrorStories = computed(() => {
  return stories.value ? stories.value.filter(story => story.category === 'Horror') : [];
});
</script>

<template>
  <!-- Header -->
  <Header />

  <!-- Main Content -->
  <div class="text-center mt-12 px-4">
    <!-- Heading -->
    <h2 class="text-4xl font-bold mb-4">Welcome to Storytime</h2>

    <!-- Description -->
    <p class="text-quartz-600 mb-8 max-w-4xl mx-auto">
      The world's most-loved social storytelling platform. Story time connects a
      global community of 90 million readers and writers through the power of
      story.
    </p>

    <!-- Search Bar -->
    <div class="flex justify-center items-center mb-12">
      <div class="relative w-full max-w-2xl">
        <input type="text" placeholder="Search story"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10" />
        <NuxtLink to="/Search" class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 rounded-r-md">
          <img src="/img/Vector (1).png" alt="Search Icon" class="h-5 w-5" />
        </NuxtLink>
      </div>
    </div>

    <!-- Illustration -->
    <div class="flex justify-center">
      <img src="/img/image 14.png" alt="Illustration" class="w-full max-w-xl" />
    </div>
  </div>

  <!-- Latest Story -->
  <div class="px-8 py-8">
    <div class="flex items-center justify-between mb-4 px-10">
      <h2 class="text-4xl font-serif font-bold text-raisin black mb-0">
        Latest Story
      </h2>
      <NuxtLink to="/" class="flex items-center cursor-pointer hover:text-black">
        <span class="text-sm text-gray-500 hover:text-black">Explore More</span>
        <img src="public/img/next.png" alt="next" class="w-4 h-4 ml-1" />
      </NuxtLink>
    </div>

    <!-- Line Separator -->
    <img src="public/img/Line 12.png" alt="Separator Line" class="w-full my-2 px-10" />
    <!-- Story Card Latest Story -->
    <div class="px-4 py-4">
      <!-- Latest Story -->
      <LatestStory :stories="stories" />
    </div>
  </div>

  <!-- Comedy Category -->
  <div class="px-8 py-8">
    <div class="px-12 mt-8">
      <div class="flex items-center justify-between">
        <h3 class="text-4xl font-serif font-bold text-raisin black">
          Comedy
        </h3>
        <div class="flex items-center cursor-pointer hover:text-black">
          <span class="text-sm text-gray-500 hover:text-black">Explore More</span>
          <img src="public/img/next.png" alt="next" class="w-4 h-4 ml-1" />
        </div>
      </div>

      <!-- Line Separator -->
      <img src="public/img/Line 12.png" alt="Separator Line" class="w-full mt-8 px-25" />
    </div>
    <!-- Card Comedy -->
    <MainComedy :stories="comedyStories" />
  </div>

  <!-- Romance Category -->
  <div>
    <div class="px-6 py-2">
      <div class="flex items-center justify-between px-14">
        <h3 class="text-4xl font-serif font-bold text-raisin black">
          Romance
        </h3>
        <div class="flex items-center cursor-pointer hover:text-black">
          <span class="text-sm text-gray-500 hover:text-black">Explore More</span>
          <img src="public/img/next.png" alt="next" class="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
    <!-- Line Separator -->
    <img src="public/img/Line 12.png" alt="Separator Line" class="w-full my-8 px-20" />
    <!-- Card Romance -->
    <MainRomance :stories="romanceStories" />
  </div>

  <!-- Horror Category -->
  <div class="px-8 py-8">
    <div class="px-12 mt-8">
      <div class="flex items-center justify-between">
        <h3 class="text-4xl font-serif font-bold text-raisin black">
          Horror
        </h3>
        <div class="flex items-center cursor-pointer hover:text-black">
          <span class="text-sm text-gray-500 hover:text-black">Explore More</span>
          <img src="public/img/next.png" alt="next" class="w-4 h-4 ml-1" />
        </div>
      </div>

      <!-- Line Separator -->
      <img src="public/img/Line 12.png" alt="Separator Line" class="w-full mt-8 px-25" />
    </div>
    <!-- Card Horror -->
    <MainHorror :stories="horrorStories" />
  </div>

  <div class="p-8 bg-white">
    <!-- Judul -->
    <h2 class="text-2xl font-semibold mb-6 ml-12">More Categories</h2>
    <hr class="border-t border-gray-200 mb-8 ml-12" />

    <!-- Grid Kategori -->
    <div class="grid grid-cols-2 md:grid-cols-7 gap-2 ml-12">
      <NuxtLink to="/Categories/Comedy"
        class="bg-[#F0F5ED] text-center text-[#466543] py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40"
        onmouseover="this.style.backgroundColor='#DCEEDD'; this.style.color='black';"
        onmouseout="this.style.backgroundColor='rgb(240, 253, 244)'; this.style.color='#466543';">
        Comedy
      </NuxtLink>

      <NuxtLink to="/Categories/Romance"
        class="bg-[#F0F5ED] text-center text-[#466543] py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40"
        onmouseover="this.style.backgroundColor='#DCEEDD'; this.style.color='black';"
        onmouseout="this.style.backgroundColor='rgb(240, 253, 244)'; this.style.color='#466543';">
        Romance
      </NuxtLink>
      <NuxtLink to="/Categories/Horror"
        class="bg-[#F0F5ED] text-center text-[#466543] py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40"
        onmouseover="this.style.backgroundColor='#DCEEDD'; this.style.color='black';"
        onmouseout="this.style.backgroundColor='rgb(240, 253, 244)'; this.style.color='#466543';">
        Horror
      </NuxtLink>
      <NuxtLink to="/Categories/Adventure"
        class="bg-[#F0F5ED] text-center text-[#466543] py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40"
        onmouseover="this.style.backgroundColor='#DCEEDD'; this.style.color='black';"
        onmouseout="this.style.backgroundColor='rgb(240, 253, 244)'; this.style.color='#466543';">
        Adventure
      </NuxtLink>
      <NuxtLink to="/Categories/Fiction"
        class="bg-[#F0F5ED] text-center text-[#466543] py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40"
        onmouseover="this.style.backgroundColor='#DCEEDD'; this.style.color='black';"
        onmouseout="this.style.backgroundColor='rgb(240, 253, 244)'; this.style.color='#466543';">
        Fiction
      </NuxtLink>
      <NuxtLink to="/Categories/Fantasy"
        class="bg-[#F0F5ED] text-center text-[#466543] py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40"
        onmouseover="this.style.backgroundColor='#DCEEDD'; this.style.color='black';"
        onmouseout="this.style.backgroundColor='rgb(240, 253, 244)'; this.style.color='#466543';">
        Fantasy
      </NuxtLink>
      <NuxtLink to="/Categories/Drama"
        class="bg-[#F0F5ED] text-center text-[#466543] py-8 px-6 rounded-md transition-all duration-700 transform hover:scale-105 cursor-pointer w-40"
        onmouseover="this.style.backgroundColor='#DCEEDD'; this.style.color='black';"
        onmouseout="this.style.backgroundColor='rgb(240, 253, 244)'; this.style.color='#466543';">
        Drama
      </NuxtLink>
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
</template>

<!-- <style lang="scss">
/* Optional: Tambahkan margin dan padding untuk responsif */
</style> -->
