<script setup>
// Ref for profile picture
const userIconSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4'/></svg>`;

// APi Call
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// State management
const headerRef = ref(null);
const isModalOpen = ref(false);
const profilePicture = ref(null);
const nameInput = ref('');
const aboutInput = ref('');
const oldPasswordInput = ref('');
const newPasswordInput = ref('');
const confirmPasswordInput = ref('');

// Computed user data
const user = computed(() => headerRef.value?.user || null);
const userStories = ref([]);

// File input handling
const triggerFileInput = () => {
  document.getElementById('file-input').click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await $fetch(`${apiUrl}/api/user/update-profile-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${useCookie('token').value}`
        }
      });

      // Update user profile image
      if (response.user?.profile_image) {
        headerRef.value.user.profile_image = response.user.profile_image;

        // Preview the uploaded image
        const reader = new FileReader();
        reader.onload = (e) => {
          profilePicture.value = e.target.result;
        };
        reader.readAsDataURL(file);

        alert('Profile image updated successfully');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert(error.data?.message || 'Failed to update profile image');
    }
  }
};

// Profile update handler
const updateProfile = async () => {
  try {
    const response = await $fetch(`${apiUrl}/api/user/update-profile`, {
      method: 'PUT',
      body: {
        name: nameInput.value,
        about: aboutInput.value,
        old_password: oldPasswordInput.value || undefined,
        new_password: newPasswordInput.value || undefined,
        new_password_confirmation: confirmPasswordInput.value || undefined
      },
      headers: {
        'Authorization': `Bearer ${useCookie('token').value}`
      }
    });

    // Update user data in header
    if (headerRef.value && response.user) {
      headerRef.value.user.name = response.user.name;
      headerRef.value.user.about = response.user.about;
    }

    // Reset form inputs
    nameInput.value = '';
    aboutInput.value = '';
    oldPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';

    // Close modal
    isModalOpen.value = false;

    alert('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert(error.data?.message || 'Failed to update profile');
  }
};

// Get Story by User
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = 4;

const getStoryByUser = async () => {
  try {
    console.log('Fetching stories...');
    const response = await $fetch(`${apiUrl}/api/user/stories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${useCookie('token').value}`,
      },
      query: {
        page: currentPage.value,
        per_page: perPage,
      },
    });

    console.log('API Response:', response);
    userStories.value = response.data || [];
    totalPages.value = response.meta?.last_page || 1;
  } catch (error) {
    console.error('Error fetching stories:', error);
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchStories();
  }
};

watch(currentPage, getStoryByUser);
onMounted(getStoryByUser);

const getImageUrl = (imagePath) => {
  console.log('Original Image Path:', imagePath);

  if (!imagePath) {
    console.log('No image path, using default icon');
    return userIconSvg;
  }

  if (imagePath.startsWith('http')) {
    console.log('Full URL image:', imagePath);
    return imagePath;
  }

  const fullUrl = `${apiUrl}/storage/${imagePath}`;
  console.log('Constructed Full URL:', fullUrl);

  return fullUrl || userIconSvg;
};

//Saat modal edit profile dibuka, maka diubah menjadi true
watch(isModalOpen, (newValue) => {
  if (newValue && user.value) {
    nameInput.value = user.value.name || '';
    aboutInput.value = user.value.about || '';
    profilePicture.value = getImageUrl(user.value.profile_image) || null;
  }
});
</script>

<template>
  <Header ref="headerRef" />

  <!-- Header Profile -->
  <main class="flex flex-col items-center justify-center flex-grow">
    <div class="rounded-lg w-full mx-auto p-6" style="margin-right: 600px; background-color: #f0f5ed">
      <div class="flex items-start sm:flex-row flex-col space-y-6 sm:space-y-0 sm:space-x-6">
        <!-- Profile Image -->
        <img :src="getImageUrl(user?.profile_image)" alt="Profile Image"
          class="rounded-full object-cover mx-auto sm:mx-0"
          style="margin-left: 100px; margin-top: 8px; width: 155px; height: 155px; padding: 20px;" />
        <!-- Profile Details -->
        <div class="flex-grow">
          <h1 class="text-2xl font-bold" style="color: #222222; margin-top: 30px; margin-left: 20px">
            {{ user?.name || "User" }}
          </h1>
          <!-- Email -->
          <p class="text-sm mt-2" style="color: #222222; margin-left: 20px">
            {{ user?.email || "Email" }}
          </p>
          <!-- About Me -->
          <p class="text-sm mt-3 leading-relaxed" style="color: #4b4b4b; margin-left: 20px">
            {{ user?.about || "About Me" }}
          </p>
        </div>
        <!-- Edit Button -->
        <button @click="isModalOpen = true"
          class="bg-lime-800 text-white text-sm px-6 py-2 rounded-md hover:bg-lime-900 transition duration-300"
          style="margin-right: 490px; margin-top: 70px">
          Edit Profile
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-start">
          <h2 class="text-xl font-semibold text-gray-800">Edit Profile</h2>
          <button @click="isModalOpen = false" class="text-gray-500 hover:text-gray-700 transition">
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Left Column -->
          <div class="w-full lg:w-1/2 space-y-6">
            <!-- Profile Picture -->
            <div class="flex items-center space-x-4">
              <!-- Profile Picture Display -->
              <div class="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                <img :src="profilePicture || user?.profile_image || userIconSvg" alt="Profile Picture"
                  class="w-full h-full object-cover" />
              </div>

              <!-- Change Picture Button -->
              <button @click="triggerFileInput"
                class="px-4 py-2 border border-[#466543] text-[#466543] rounded hover:border-black hover:text-black transition">
                Change Picture
              </button>

              <!-- Hidden File Input -->
              <input id="file-input" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
            </div>

            <div class="space-y-6 max-w-md mx-auto">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">Name</label>
                <input v-model="nameInput" type="text" class="w-full p-2 border rounded bg-white-100"
                  placeholder="Enter your name" />
              </div>

              <!-- Email (Read-only) -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <div class="p-2 border rounded bg-[#F9FBF8] text-gray-500">
                  {{ user?.email }}
                </div>
              </div>

              <!-- About Me -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-2">About Me</label>
                <textarea v-model="aboutInput" class="w-full p-2 border rounded bg-white-100 text-gray-700 resize-none"
                  rows="4" placeholder="Tell us about yourself"></textarea>
              </div>
            </div>
          </div>

          <!-- Right Column (Password Change) -->
          <div class="w-full max-w-lg mx-auto space-y-6">
            <h3 class="text-lg font-semibold text-gray-800">Change Password</h3>

            <!-- Old Password -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">
                Old Password
              </label>
              <input v-model="oldPasswordInput" type="password" placeholder="Enter your old password"
                class="w-full px-4 py-2 border rounded focus:ring focus:ring-green-200 focus:outline-none" />
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">
                New Password
              </label>
              <input v-model="newPasswordInput" type="password" placeholder="Enter your new password"
                class="w-full px-4 py-2 border rounded focus:ring focus:ring-green-200 focus:outline-none" />
            </div>

            <!-- Confirm New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">
                Confirm New Password
              </label>
              <input v-model="confirmPasswordInput" type="password" placeholder="Re-enter your new password"
                class="w-full px-4 py-2 border rounded focus:ring focus:ring-green-200 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-8">
          <button @click="isModalOpen = false"
            class="px-4 py-2 border border-[#466543] text-[#466543] rounded hover:text-black hover:border-black transition duration-200">
            Cancel
          </button>

          <button @click="updateProfile"
            class="px-6 py-2 bg-[#466543] text-white font-medium rounded hover:bg-[#3b5739] focus:outline-none focus:ring-2 focus:ring-[#466543] focus:ring-opacity-50">
            Update Profile
          </button>
        </div>

        <!-- Notification -->
        <div v-if="isNotificationVisible"
          class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-gray-300 rounded flex items-center px-4 py-2 w-full max-w-sm sm:max-w-md mt-4">
          <svg class="w-6 h-6 text-green-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <p class="ml-3 text-gray-800 text-sm font-medium flex-grow">
            Successfully edited your profile
          </p>
          <button @click="isNotificationVisible = false" class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Nav Menu Section -->
    <div class="font-sans p-6" style="background-color: white; margin-right: 1180px">
      <div class="max-w-7xl mx-auto">
        <!-- Navigation Section -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div class="flex flex-col sm:flex-row sm:space-x-6 mt-15px">
            <button class="text-semibold-600 font-semibold px-3 py-3 sm:w-auto w-full"
              style="background-color: #f0f5ed; border-radius: 0.375rem">
              My Story
            </button>

            <a href="/Bookmark" class="px-4 py-2 text-semibold-600 font-semibold">Bookmark</a>
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
          <NuxtLink to="Story/Create">
            <span class="bg-[#466543] text-white px-4 py-3 rounded-md hover:bg-lime-900 mt-6">
              Write Story
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- User Stories -->
      <div
        class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mx-20 min-h-[500px] flex flex-col justify-between">
        <ProfileStory :userStories="userStories" />
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="mt-12 w-full flex justify-center items-center space-x-2 pl-28">
      <!-- Tombol "Prev" hanya muncul jika currentPage > 1 -->
      <button v-if="currentPage > 1" @click="changePage(currentPage - 1)"
        class="px-4 py-2 bg-[#F0F5ED] text-black hover:text-white hover:bg-lime-900 rounded">
        Prev
      </button>

      <!-- Nomor halaman -->
      <button v-for="page in totalPages" :key="page" @click="changePage(page)" class="px-4 py-2 rounded transition-all"
        :class="{
          'bg-[#466543] hover:bg-[#3B4F3A] text-white font-semibold': currentPage === page,
          'bg-[#F0F5ED] text-black hover:text-white font-semibold hover:bg-[#3B4F3A]': currentPage !== page
        }">
        {{ page }}
      </button>

      <!-- Tombol "Next" hanya muncul jika belum di halaman terakhir -->
      <button v-if="currentPage < totalPages" @click="changePage(currentPage + 1)"
        class="px-4 py-2 bg-[#F0F5ED] text-black hover:bg-[#3B4F3A] hover:text-white rounded">
        Next
      </button>
    </div>
  </main>

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
