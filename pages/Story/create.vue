<script setup></script>

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
                <input type="text" placeholder="Enter a story title"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>

            <!-- Category Selector -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">Category</label>
                <input type="text" placeholder="Select a category"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>

            <!-- Content Input -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">Content</label>
                <div class="border border-white-300 rounded-lg">
                    <!-- Toolbar -->
                    <div class="flex flex-wrap items-center bg-white-100 p-2 space-x-2">
                        <button class="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded" title="Normal">
                            Normal
                        </button>
                        <button class="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded" title="Bold">
                            <b>B</b>
                        </button>
                        <button class="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded" title="Italic">
                            <i>I</i>
                        </button>
                        <button class="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded" title="Underline">
                            <u>U</u>
                        </button>
                        <button class="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded" title="Link">
                            🔗
                        </button>
                        <button class="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded" title="Numbered List">
                            1.
                        </button>
                        <button class="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded" title="Bulleted List">
                            •
                        </button>
                        <button class="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded" title="Strikethrough">
                            <s>Tx</s>
                        </button>
                    </div>
                    <!-- Textarea -->
                    <textarea rows="6" placeholder="Enter a content here"
                        class="w-full p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
                </div>
            </div>

            <!-- Cover Image Upload -->
            <div class="mb-6" style="margin-right: 850px">
                <label class="block text-sm font-medium text-gray-700 mb-4">Cover Image</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center">
                    <div class="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm1 2h10v4l-2.5-2.5-3 3L6 8l-3 3V5a1 1 0 011-1zm0 7l2-2 3 3 2.5-2.5L15 14H5z"
                                clip-rule="evenodd" />
                        </svg>
                        <p class="text-sm text-gray-500">Choose image</p>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-start space-x-3">
                <a href="/profile"
                    class="px-4 py-2 border border-[#466543] text-[#466543] rounded hover:text-black hover:border-black transition duration-200">
                    Cancel
                </a>

                <a href="/profile">
                    <button class="bg-[#466543] hover:bg-lime-900 text-white py-2 px-4 rounded-lg">
                        Post Story
                    </button>
                </a>
            </div>
        </div>
    </div>
</template>
