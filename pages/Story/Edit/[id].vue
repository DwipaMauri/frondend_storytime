<script setup>
import RichEditor from "~/components/rich-editor.vue";

// API Call
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// Reactive form data
const title = ref('');
const content = ref('');
const categoryId = ref(null);
const contentImages = ref([]);
const coverImage = ref(null);
const imagePreview = ref(null);
const fileInput = ref(null);
const categories = ref([]);
const errors = ref({});
const isLoading = ref(false);

const router = useRouter();

// Fetch story details
const fetchStory = async (storyId) => {
    try {
        const response = await $fetch(`${apiUrl}/api/stories/${storyId}`, {
            headers: {
                Authorization: `Bearer ${useCookie('token').value}`,
            },
        });

        if (!response.data) {
            throw new Error('No story data received');
        }

        const storyData = response.data;

        title.value = storyData.title || '';
        content.value = storyData.content || '';
        categoryId.value = storyData.category?.id || null;
        contentImages.value = storyData.content_images?.map((img) => ({
            id: img.id,
            url: img.url,
            file: null,
            isExisting: true 
        })) || [];

        if (storyData.cover_image_url) {
            imagePreview.value = storyData.cover_image_url;
        }
    } catch (error) {
        console.error('Failed to fetch story details:', error);
        alert('Failed to load story. Please try again.');
    }
};

// Fetch categories
const fetchCategories = async () => { 
    try {
        const response = await $fetch(`${apiUrl}/api/categories`, {
            headers: {
                'Authorization': `Bearer ${useCookie('token').value}`,
            }, 
        }); 
        categories.value = response.data || [];
        if (!categoryId.value && categories.value.length > 0) {
            categoryId.value = categories.value[0].id;
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
};

// HandleFileChange function
const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        const remainingSlots = 3 - contentImages.value.length;

        if (remainingSlots > 0) {
            const newImages = files.slice(0, remainingSlots).map((file) => ({
                id: `temp-${Date.now()}-${Math.random()}`, 
                file: file,
                url: URL.createObjectURL(file), 
                isNew: true
            }));

            // Combine existing images with new ones
            contentImages.value = [...contentImages.value, ...newImages];
        } else {
            alert('You cannot upload more than 3 images.');
        }
    }

    // Reset input
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Function to trigger file input
const triggerFileInput = () => {
    fileInput.value?.click();
};


// Modified removeContentImage function
const removeContentImage = (indexToRemove) => {
    const imageToRemove = contentImages.value[indexToRemove];

    // Create new array without the removed image
    contentImages.value = contentImages.value.filter((_, index) => index !== indexToRemove);

    // If it's a new image, clean up the object URL
    if (imageToRemove?.isNew) {
        URL.revokeObjectURL(imageToRemove.url);
    }
};

// UpdateStory function
const updateStory = async () => {
    errors.value = {};

    // Validation checks
    if (!title.value.trim()) errors.value.title = 'Title is required';
    if (!content.value.trim()) errors.value.content = 'Content is required';
    if (!categoryId.value) errors.value.category = 'Category is required';

    if (Object.keys(errors.value).length > 0) return;

    isLoading.value = true;

    try {
        const formData = new FormData();
        formData.append('_method', 'PUT'); 
        formData.append('title', title.value);
        formData.append('content', content.value);
        formData.append('category_id', categoryId.value);

        // Handle existing images
        const existingImageIds = contentImages.value
            .filter(img => !img.isNew)
            .map(img => img.id);
        formData.append('existing_images', JSON.stringify(existingImageIds));

        // Handle new images
        const newImages = contentImages.value.filter(img => img.isNew);
        newImages.forEach((image, index) => {
            if (image.file) {
                formData.append(`content_images[${index}]`, image.file);
            }
        });

        const storyId = router.currentRoute.value.params.id;
        const response = await $fetch(`${apiUrl}/api/stories/${storyId}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${useCookie('token').value}`,
            }
        });

        if (response.data) {
            // Update local state with server response
            contentImages.value = response.data.content_images.map(img => ({
                ...img,
                isNew: false
            }));

            alert('Story updated successfully!');
            await router.push('/profile');
        }
    } catch (error) {
        console.error('Update failed:', error);
        alert(`Failed to update story: ${error.message || 'Unknown error'}`);
    } finally {
        isLoading.value = false;
    }
};

// Cleanup URLs when component is unmounted
onBeforeUnmount(() => {
    contentImages.value.forEach(image => {
        if (image.isNew) {
            URL.revokeObjectURL(image.url);
        }
    });
});

// Component mounted actions
onMounted(() => { 
    const storyId = router.currentRoute.value.params.id;
    if (!storyId) {
        alert('No story ID provided');
        router.push('/profile');
        return;
    }
    fetchStory(storyId);
    fetchCategories();
});
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
                <h1 class="text-2xl font-semibold ml-3">Edit Story</h1>
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
                <select v-model="categoryId"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    :class="{ 'border-red-500': errors.category }">
                    <option>Select a category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
                <p v-if="errors.category" class="text-red-500 text-sm mt-1">{{ errors.category }}</p>
            </div>

            <!-- Content Input -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">Content</label>
                <client-only>
                    <rich-editor v-model="content" />
                </client-only>
                <p v-if="errors.content" class="text-red-500 text-sm mt-1">{{ errors.content }}</p>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-4">Cover Image</label>
                <div class="border-2 h-60 w-3/5 max-w-3xl flex items-center justify-center cursor-pointer relative"
                    @click="triggerFileInput">
                    <!-- Show when no image is uploaded -->
                    <div v-if="!contentImages.length" class="flex flex-col items-center justify-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm1 2h10v4l-2.5-2.5-3 3L6 8l-3 3V5a1 1 0 011-1zm0 7l2-2 3 3 2.5-2.5L15 14H5z"
                                clip-rule="evenodd" />
                        </svg>
                        <p class="text-sm text-gray-500">Choose image</p>
                    </div>

                    <!-- Show uploaded image previews -->
                    <div v-if="contentImages.length > 0" class="relative w-full">
                        <div class="grid grid-cols-3 gap-4">
                            <div v-for="(image, index) in contentImages" :key="image.id || index" class="relative">
                                <img :src="image.url" alt="Content Image" class="w-full h-60 object-cover rounded-lg" />
                                <button @click.stop="removeContentImage(index)"
                                    class="absolute top-2 right-2 bg-[#466543] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-lime-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M6.293 4.293a1 1 0 011.414 0L10 6.586l2.293-2.293a1 1 0 111.414 1.414L11.414 8l2.293 2.293a1 1 0 11-1.414 1.414L10 9.414l-2.293 2.293a1 1 0 11-1.414-1.414L8.586 8 6.293 5.707a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Hidden file input -->
                    <input ref="fileInput" type="file" class="hidden" multiple accept="image/*"
                        @change="handleFileChange" />
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-start space-x-3">
                <a href="/profile"
                    class="px-4 py-2 border border-[#466543] text-[#466543] rounded hover:text-black hover:border-black transition duration-200">
                    Cancel
                </a>

                <button @click="updateStory" :disabled="isLoading"
                    class="bg-[#466543] hover:bg-lime-900 text-white py-2 px-4 rounded-lg">
                    <span v-if="isLoading">Posting...</span>
                    <span v-else>Update Story</span>
                </button>
            </div>
        </div>
    </div>
</template>
