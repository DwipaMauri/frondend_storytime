<script setup>
import RichEditor from "~/components/rich-editor.vue";

// API URL
const config = useRuntimeConfig();
const apiUrl = config.public.apiBase;

// Reactive states
const title = ref('');
const content = ref('');
const categoryId = ref('');
const fileInput = ref(null);

// Ubah coverImage & imagePreview jadi array
const imagePreviews = ref([]);
const contentImages = ref([]);

const categories = ref([]);
const errors = ref({});
const isLoading = ref(false);
const stories = ref([]);
const router = useRouter();

// Function to trigger file input
const triggerFileInput = () => {
    if (fileInput.value) fileInput.value.click();
};

const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 3) {
        alert('You cannot upload more than 3 images.');
        return;
    }

    if (files.length > 0) {
        // Kosongkan dulu array
        imagePreviews.value = [];
        contentImages.value = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Tambahkan hasil pembacaan ke array pratinjau
                imagePreviews.value.push(e.target.result);
            };
            reader.readAsDataURL(file);

            // Simpan file asli untuk di-upload
            contentImages.value.push(file);
        });
    }
};

// Fungsi hapus gambar tertentu dari daftar sebelum dikirim ke backend
const removeImage = (index) => {
    imagePreviews.value.splice(index, 1);
    contentImages.value.splice(index, 1);
};

// Mengambil daftar kategori dan story dari backend
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
    errors.value = {}; //Mengosongkan error agar tidak ada sisa pesan error dari percobaan sebelumnya

    //Sebelum mengirim data ke backend
    if (!title.value.trim()) errors.value.title = 'Title is required';
    if (!content.value.trim()) errors.value.content = 'Content is required';
    if (!categoryId.value) errors.value.category = 'Category is required';

    // Misalnya mewajibkan minimal 1 gambar
    if (contentImages.value.length === 0) {
        errors.value.cover_image = 'At least 1 image is required';
    }

    if (Object.keys(errors.value).length > 0) return; //Jika ada error, proses akan dihentikan 

    //Data dikemas dalam FormData untuk mendukung pengiriman data
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);
    formData.append('category_id', categoryId.value);

    // Upload semua gambar ke formData
    contentImages.value.forEach((image, index) => {
        formData.append(`content_images[${index}]`, image); //Menambahkan semua gambar yang dipilih
    });

    // Debugging FormData
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    } //Mencetak isi formData ke console untuk memastikan data yang dikirim benar

    isLoading.value = true; //Proses sedang berlangsung 
    try {
        const response = await $fetch(`${apiUrl}/api/stories`, {
            method: 'POST', //Mengirim data ke backend melalui API 
            body: formData,
            headers: {
                'Authorization': `Bearer ${useCookie('token').value}`,
            }, //Menyertakan token autentikasi dalam header agar backend tahu siapa yang mengunggah
        });

        console.log('Story created:', response);
        alert('Story created successfully!'); //Jika berhasil, maka akan diarahkan ke halaman profile
        router.push('/profile');
    } catch (error) { //Jika error berasal dari backend (error.data.errors), pesan error dari backend ditampilkan ke pengguna
        console.error('Story creation failed:', error);
        if (error.data && error.data.errors) {
            errors.value = error.data.errors;
        } else {
            alert('Failed to create story. Please try again.'); //Jika tidak ada pesan, tampilkan secara umum 
        }
    } finally {
        isLoading.value = false;
    } //Setelah proses selesai (baik sukses maupun gagal), isLoading dikembalikan ke false agar UI tidak terus menampilkan status "Posting..."
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
                <client-only>
                    <rich-editor v-model="content" />
                </client-only>
                <p v-if="errors.content" class="text-red-500 text-sm mt-1">{{ errors.content }}</p>
            </div>

            <!-- Cover Image Upload -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-4">Cover Image</label>
                <div class="border-2 h-60 w-3/5 max-w-3xl flex items-center justify-center cursor-pointer relative"
                    @click="triggerFileInput">
                    <!-- Jika belum ada gambar yang diunggah -->
                    <div v-if="imagePreviews.length === 0" class="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm1 2h10v4l-2.5-2.5-3 3L6 8l-3 3V5a1 1 0 011-1zm0 7l2-2 3 3 2.5-2.5L15 14H5z"
                                clip-rule="evenodd" />
                        </svg>
                        <p class="text-sm text-gray-500">Choose image</p>
                    </div>

                    <!-- Jika sudah ada gambar yang diunggah -->
                    <div v-else class="absolute top-0 left-0 h-full grid grid-cols-3 gap-4">
                        <div v-for="(preview, index) in imagePreviews" :key="index" class="relative h-56">
                            <img :src="preview" alt="Cover Image Preview" class="w-full h-60 object-cover rounded-lg" />
                            <!-- Tombol hapus -->
                            <button @click.stop="removeImage(index)"
                                class="absolute top-2 right-2 bg-[#466543] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-lime-900">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M6.707 4.293a1 1 0 00-1.414 1.414L8.586 9l-3.293 3.293a1 1 0 001.414 1.414L10 10.414l3.293 3.293a1 1 0 001.414-1.414L11.414 9l3.293-3.293a1 1 0 00-1.414-1.414L10 7.586 6.707 4.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Hidden file input -->
                    <input type="file" multiple @change="handleFileChange" ref="fileInput" class="hidden"
                        accept="image/*" />
                </div>
                <!-- Contoh pesan error jika butuh -->
                <p v-if="errors.imagePreviews" class="text-red-500 text-sm mt-1">
                    {{ errors.imagePreviews }}
                </p>
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
