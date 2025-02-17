<script setup>
import RichEditor from "~/components/rich-editor.vue";

// API URL
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// Reactive states
const title = ref('');
const content = ref('');
const categoryId = ref('');
const coverImage = ref(null);
const imagePreview = ref(null);
const fileInput = ref(null);
const contentImages = ref([]);
const categories = ref([]);
const errors = ref({});
const isLoading = ref(false);
const stories = ref([]); // Tambahkan deklarasi variabel ini
const router = useRouter();

// Function to trigger file input
const triggerFileInput = () => {
    if (fileInput.value) fileInput.value.click();
};

const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Ambil semua file yang dipilih
    if (files.length > 0) {
        contentImages.value = []; // Kosongkan array sebelum menambahkan gambar baru

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.value = e.target.result; // Tampilkan preview cover image pertama
                contentImages.value.push(file); // Tambahkan file ke daftar contentImages
            };
            reader.readAsDataURL(file);
        });

        coverImage.value = files[0]; // Set cover image pertama
    }
};

// Remove selected image
const removeImage = () => {
    imagePreview.value = null;
    coverImage.value = null;
    if (fileInput.value) fileInput.value.value = '';
};

// Handle additional content images
const handleContentImageUpload = (event) => {
    contentImages.value = Array.from(event.target.files);
};

// Fetch stories on mount
onMounted(async () => {
    try {
        const responseStories = await $fetch(`${apiUrl}/api/stories`);
        const responseCategories = await $fetch(`${apiUrl}/api/categories`);
        categories.value = responseCategories.data;
        stories.value = responseStories.data;
    } catch (error) {
        console.error('Failed to load stories:', error);
    }
});

const createStory = async () => {
    errors.value = {};

    // Validation
    if (!title.value.trim()) errors.value.title = 'Title is required';
    if (!content.value.trim()) errors.value.content = 'Content is required';
    if (!categoryId.value) errors.value.category = 'Category is required';

    if (Object.keys(errors.value).length > 0) return;

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);
    formData.append('category_id', categoryId.value);

    // Tambahkan cover image ke FormData
    if (coverImage.value) {
        formData.append('cover_image', coverImage.value);
    }

    // Tambahkan content images ke FormData
    contentImages.value.forEach((image, index) => {
        formData.append(`content_images[${index}]`, image);
    });

    // Debugging FormData
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    }

    isLoading.value = true;
    try {
        const response = await $fetch(`${apiUrl}/api/stories`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${useCookie('token').value}`,
            },
        });

        console.log('Story created:', response);
        alert('Story created successfully!');
        router.push('/profile');
    } catch (error) {
        console.error('Story creation failed:', error);
        if (error.data && error.data.errors) {
            errors.value = error.data.errors; // Tangkap pesan error dari API
        } else {
            alert('Failed to create story. Please try again.');
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-2">
        <div class="bg-white shadow-md rounded-lg w-full max-w-7xl p-4">
            <Header />

            <div class="flex items-center my-10">
                <a href="/profile" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </a>
                <h1 class="text-2xl font-semibold ml-3">Write Story</h1>
            </div>

            <!-- Title Input -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">Title</label>
                <input v-model="title" type="text" placeholder="Enter a story title"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    :class="{ 'border-red-500': errors.title }" />
                <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
            </div>

            <!-- Category Selector -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">Category</label>
                <select v-model="categoryId" class="w-full p-3 border rounded-lg"
                    :class="{ 'border-red-500': errors.category }">
                    <option value="" disabled>Select a category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
                <p v-if="errors.category" class="text-red-500 text-sm">{{ errors.category }}</p>
            </div>

            <!-- Content Input -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">Content</label>
                <!-- <textarea v-model="content" rows="6" placeholder="Enter content here"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    :class="{ 'border-red-500': errors.content }"></textarea> -->
                <client-only>
                    <rich-editor v-model="content" />
                </client-only>
                <p v-if="errors.content" class="text-red-500 text-sm mt-1">{{ errors.content }}</p>
            </div>

            <!-- Cover Image Upload -->
            <div class="mb-6" style="margin-right: 850px">
                <label class="block text-sm font-medium text-gray-700 mb-4">Cover Image</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg h-80 w-full flex items-center justify-center cursor-pointer relative"
                    @click="triggerFileInput">
                    <!-- No image uploaded -->
                    <div v-if="!imagePreview" class="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm1 2h10v4l-2.5-2.5-3 3L6 8l-3 3V5a1 1 0 011-1zm0 7l2-2 3 3 2.5-2.5L15 14H5z"
                                clip-rule="evenodd" />
                        </svg>
                        <p class="text-sm text-gray-500">Choose image</p>
                    </div>

                    <!-- Image uploaded -->
                    <div v-else class="absolute top-0 left-0 w-full h-full">
                        <img :src="imagePreview" alt="Cover Image Preview"
                            class="w-full h-full object-cover rounded-lg" />
                        <!-- Remove image button -->
                        <button @click.stop="removeImage"
                            class="absolute top-2 right-2 bg-[#466543] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-lime-900">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M6.707 4.293a1 1 0 00-1.414 1.414L8.586 9l-3.293 3.293a1 1 0 001.414 1.414L10 10.414l3.293 3.293a1 1 0 001.414-1.414L11.414 9l3.293-3.293a1 1 0 00-1.414-1.414L10 7.586 6.707 4.293z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <!-- Hidden file input -->
                    <input type="file" multiple @change="handleFileChange" ref="fileInput" class="hidden"
                        accept="image/*" />
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-start space-x-3">
                <a href="/profile"
                    class="px-4 py-2 border border-[#466543] text-[#466543] rounded hover:text-black hover:border-black transition duration-200">
                    Cancel
                </a>

                <button @click="createStory" :disabled="isLoading"
                    class="bg-[#466543] hover:bg-lime-900 text-white py-2 px-4 rounded-lg">
                    <span v-if="isLoading">Posting...</span>
                    <span v-else>Post Story</span>
                </button>
            </div>
        </div>
    </div>
</template>