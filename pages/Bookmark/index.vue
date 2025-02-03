<script setup></script>

<template>
  <Header />

  <!-- Header Profile -->
  <main class="flex flex-col items-center justify-center flex-grow">
    <div class="rounded-lg w-full mx-auto p-6" style="margin-right: 600px; background-color: #f0f5ed">
      <div class="flex items-start sm:flex-row flex-col space-y-6 sm:space-y-0 sm:space-x-6">
        <!-- Profile Image -->
        <img src="https://i.pinimg.com/originals/39/88/71/398871ed89c875c647c3cf0184f24c3a.jpg" alt="Profile Image"
          class="rounded-full object-cover mx-auto sm:mx-0" style="
            margin-left: 100px;
            margin-top: 8px;
            width: 150px;
            height: 150px;
          " />
        <!-- Profile Details -->
        <div class="flex-grow">
          <h1 class="text-2xl font-bold" style="color: #222222; margin-top: 30px; margin-left: 20px">
            Iswara
          </h1>
          <p class="text-sm mt-2" style="color: #222222; margin-left: 20px">
            dewiratnaiswara99@gmail.com
          </p>
          <p class="text-sm mt-3 leading-relaxed" style="color: #4b4b4b; margin-left: 20px">
            Avid reader and aspiring writer. Lover of mysteries, thrillers, and
            sci-fi. Coffee enthusiast <br />
            and nature explorer. Always on the lookout for new stories and
            adventures.
          </p>
        </div>
        <!-- Edit Button -->
        <a href="/Profile/edit">
          <button class="bg-lime-800 text-white text-sm px-6 py-2 rounded-md hover:bg-lime-900 transition duration-300"
            style="margin-right: 490px; margin-top: 70px">
            Edit Profile
          </button>
        </a>
      </div>
    </div>

    <!-- Card -->
    <div class="font-sans p-6" style="background-color: white; margin-right: 1180px">
      <div class="max-w-7xl mx-auto">
        <!-- Navigation Section -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div class="flex flex-col sm:flex-row sm:space-x-6 mt-15px">
            <a href="/Profile" class="px-4 py-2 text-semibold-600 font-semibold">My Story</a>

            <a href="/Bookmark" class="text-semibold-600 font-semibold px-3 py-3 sm:w-auto w-full"
              style="background-color: #f0f5ed; border-radius: 0.375rem">
              Bookmark
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar & Stories Section -->
    <div class="mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6" style="margin-left: 30px">
      <!-- "Write Your Story" Card -->
      <div class="container mx-auto px-1">
        <div class="border rounded-lg bg-white flex flex-col items-center justify-center py-10 h-[300px]">
          <h2 class="text-3xl font-semibold mb-4">Write your story</h2>
          <p class="text-[#222222] text-center mb-4 px-12">
            Share your unique voice with the world - start writing your story
            today!
          </p>
          <a href="/Story">
            <button class="bg-[#466543] text-white px-4 py-2 rounded-md hover:bg-lime-900 mt-6">
              Write Story
            </button>
          </a>
        </div>
      </div>

      <!-- Cards Section -->
      <!-- <div class="p-1 flex flex-col flex-grow mb-2">
        <h2 class="text-lg font-semibold mt-2 group-hover:text-[#466543] transition-colors duration-300">
          {{ story.title }}
        </h2>
        <div class="mt-4">
          <p class="text-gray-600 text-sm flex-grow">
            {{ story.preview_content || "No preview content available." }}
          </p>
        </div>
        <div class="mt-5 flex justify-between items-center">
          <span class="bg-[#F0F5ED] text-[#466543] px-3 py-1 rounded-md">
            {{ story.category.name }}
          </span>
          <span class="text-normal font-light text-gray-900">
            {{ formatDate(story.created_at) }}
          </span>
        </div>
      </div> -->
    </div>

    <!-- Button -->
    <div class="flex space-x-3 mt-10" style="margin-left: 450px">
      <!-- Page 1 Button -->
      <button class="px-4 py-2 bg-[#466543] text-white text-sm font-bold rounded-md">
        1
      </button>
      <!-- Page 2 Button -->
      <button
        class="px-4 py-2 bg-[#F0F5ED] text-[#222222] text-sm font-bold rounded-md hover:bg-[#466543] hover:text-white">
        2
      </button>
      <!-- Next Button -->
      <button
        class="px-4 py-2 bg-[#F0F5ED] text-[#222222] text-sm font-bold rounded-md hover:bg-[#466543] hover:text-white">
        Next
      </button>
    </div>

    <div class="border-t w-full border-gray-300 pt-4 text-gray-600 text-sm flex justify-between items-center"
      style="margin-top: 80px">
      <div style="margin-left: 90px">
        <p>© 2024 PT. Timedoor Indonesia. All rights reserved.</p>
      </div>
      <div class="flex space-x-4" style="margin-right: 80px">
        <a href="#" class="hover:text-gray-900">
          <img src="public/img/Icon Social Media.png" alt="Facebook" class="w-6 h-6" />
        </a>
        <a href="#" class="hover:text-gray-900">
          <img src="public/img/Icon Social Media (1).png" alt="Instagram" class="w-6 h-6" />
        </a>
        <a href="#" class="hover:text-gray-900">
          <img src="public/img/Icon Social Media (2).png" alt="YouTube" class="w-8 h-6" />
        </a>
      </div>
    </div>
  </main>
</template>
