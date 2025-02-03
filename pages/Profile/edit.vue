<script setup>
import { ref } from "vue";

// Kontrol visibilitas notifikasi
const isNotificationVisible = ref(false);

// Fungsi untuk menampilkan notifikasi
const showNotification = () => {
    isNotificationVisible.value = true;

    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
        isNotificationVisible.value = false;
    }, 3000);
};

// Data reaktif untuk menyimpan URL gambar
const profilePicture = ref(
    "https://i.pinimg.com/originals/39/88/71/398871ed89c875c647c3cf0184f24c3a.jpg"
);

// Fungsi untuk mengunggah gambar
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            profilePicture.value = reader.result; // Set URL gambar baru
        };
        reader.readAsDataURL(file);
    }
};

// Fungsi untuk memicu input file
const triggerFileInput = () => {
    document.getElementById("file-input").click();
};
</script>
<template>
    <div class="min-h-screen bg-gray-50 flex justify-center items-center px-4">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-start">
                <h2 class="text-xl font-semibold text-gray-800">Edit Profile</h2>
                <a href="/profile">
                    <button class="text-gray-500 hover:text-gray-700 transition">
                        ✕
                    </button>
                </a>
            </div>

            <!-- Content -->
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Left Column -->
                <div class="w-full lg:w-1/2 space-y-6">
                    <!-- Profile Picture -->
                    <div class="flex items-center space-x-4">
                        <!-- Tampilan Gambar -->
                        <div class="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                            <img :src="profilePicture" alt="Profile Picture" class="w-full h-full object-cover" />
                        </div>

                        <!-- Tombol Change Picture -->
                        <button @click="triggerFileInput"
                            class="px-4 py-2 border border-[#466543] text-[#466543] rounded hover:border-black hover:text-black transition">
                            Change Picture
                        </button>

                        <!-- Input File Tersembunyi -->
                        <input id="file-input" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                    </div>

                    <div class="space-y-6 max-w-md mx-auto">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-2">Name</label>
                            <div class="p-2 border rounded bg-white-100">Iswara</div>
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-2">Email</label>
                            <div class="p-2 border rounded bg-[#F9FBF8] text-gray-500">
                                dewitranaiswara99@gmail.com
                            </div>
                        </div>

                        <!-- About Me -->
                        <div>
                            <label class="block text-sm font-medium text-gray-600 mb-2">About Me</label>
                            <textarea class="w-full p-2 border rounded bg-white-100 text-gray-700 resize-none" rows="4"
                                readonly>
  Avid reader and aspiring writer. Lover of mysteries, thrillers, and sci-fi. Coffee enthusiast and nature explorer. Always on the lookout for new stories and adventures.
      </textarea>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="w-full max-w-lg mx-auto space-y-6">
                    <h3 class="text-lg font-semibold text-gray-800">Change Password</h3>

                    <!-- Old Password -->
                    <div>
                        <label for="old-password" class="block text-sm font-medium text-gray-600 mb-1">
                            Old Password
                        </label>
                        <input id="old-password" type="password" placeholder="Enter your old password"
                            class="w-full px-4 py-2 border rounded focus:ring focus:ring-green-200 focus:outline-none" />
                    </div>

                    <!-- New Password -->
                    <div>
                        <label for="new-password" class="block text-sm font-medium text-gray-600 mb-1">
                            New Password
                        </label>
                        <input id="new-password" type="password" placeholder="Enter your new password"
                            class="w-full px-4 py-2 border rounded focus:ring focus:ring-green-200 focus:outline-none" />
                    </div>

                    <!-- Confirm New Password -->
                    <div>
                        <label for="confirm-password" class="block text-sm font-medium text-gray-600 mb-1">
                            Confirm New Password
                        </label>
                        <input id="confirm-password" type="password" placeholder="Re-enter your new password"
                            class="w-full px-4 py-2 border rounded focus:ring focus:ring-green-200 focus:outline-none" />
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-8">
                <a href="/profile"
                    class="px-4 py-2 border border-[#466543] text-[#466543] rounded hover:text-black hover:border-black transition duration-200">
                    Cancel
                </a>

                <button @click="showNotification"
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
                    Successfully edit your profile
                </p>
                <button @click="isNotificationVisible = false"
                    class="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
