<script setup></script>

<template>
  <Header />

  <!-- Header Profile -->
  <main class="flex flex-col items-center justify-center flex-grow">
    <div
      class="rounded-lg w-full mx-auto p-6"
      style="margin-right: 600px; background-color: #f0f5ed"
    >
      <div
        class="flex items-start sm:flex-row flex-col space-y-6 sm:space-y-0 sm:space-x-6"
      >
        <!-- Profile Image -->
        <img
          src="https://i.pinimg.com/originals/39/88/71/398871ed89c875c647c3cf0184f24c3a.jpg"
          alt="Profile Image"
          class="rounded-full object-cover mx-auto sm:mx-0"
          style="
            margin-left: 100px;
            margin-top: 8px;
            width: 150px;
            height: 150px;
          "
        />
        <!-- Profile Details -->
        <div class="flex-grow">
          <h1
            class="text-2xl font-bold"
            style="color: #222222; margin-top: 30px; margin-left: 20px"
          >
            Iswara
          </h1>
          <p class="text-sm mt-2" style="color: #222222; margin-left: 20px">
            dewiratnaiswara99@gmail.com
          </p>
          <p
            class="text-sm mt-3 leading-relaxed"
            style="color: #4b4b4b; margin-left: 20px"
          >
            Avid reader and aspiring writer. Lover of mysteries, thrillers, and
            sci-fi. Coffee enthusiast <br />
            and nature explorer. Always on the lookout for new stories and
            adventures.
          </p>
        </div>
        <!-- Edit Button -->
        <a href="/Edit">
          <button
            class="bg-lime-800 text-white text-sm px-6 py-2 rounded-md hover:bg-lime-900 transition duration-300"
            style="margin-right: 490px; margin-top: 70px"
          >
            Edit Profile
          </button>
        </a>
      </div>
    </div>

    <!-- Card -->
    <div
      class="font-sans p-6"
      style="background-color: white; margin-right: 1180px"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Navigation Section -->
        <div
          class="flex flex-col sm:flex-row justify-between items-center mb-4"
        >
          <div class="flex flex-col sm:flex-row sm:space-x-6 mt-15px">
            <a href="/Profile" class="px-4 py-2 text-semibold-600 font-semibold"
              >My Story</a
            >

            <a
              href="/Bookmark"
              class="text-semibold-600 font-semibold px-3 py-3 sm:w-auto w-full"
              style="background-color: #f0f5ed; border-radius: 0.375rem"
            >
              Bookmark
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar & Stories Section -->
    <div
      class="mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
      style="margin-left: 30px"
    >
      <!-- "Write Your Story" Card -->
      <div class="container mx-auto px-1">
        <div
          class="border rounded-lg bg-white flex flex-col items-center justify-center py-10 h-[300px]"
        >
          <h2 class="text-3xl font-semibold mb-4">Write your story</h2>
          <p class="text-[#222222] text-center mb-4 px-12">
            Share your unique voice with the world - start writing your story
            today!
          </p>
          <a href="/Story">
            <button
              class="bg-[#466543] text-white px-4 py-2 rounded-md hover:bg-lime-900 mt-6"
            >
              Write Story
            </button>
          </a>
        </div>
      </div>

      <!-- Cards Section -->
      <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mx-20">
        <!-- Card 1 -->
        <div class="rounded-lg bg-white flex flex-col max-w-sm group">
          <!-- Gambar dan Ikon -->
          <div class="relative">
            <img
              src="https://inspiredluv.com/wp-content/uploads/2016/09/2-Beijing.jpg"
              alt="Card Image 1"
              class="rounded-t-lg group-hover:opacity-75 transition-opacity duration-300 w-full"
            />
            <!-- Ikon Bookmark -->
            <div
              class="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div
                class="bg-black text-white p-2 rounded-full shadow-md group-hover:bg-gray-800 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  class="w-6 h-6"
                >
                  <path
                    d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.5304 5.21071 22.0391 5.58579 22.4142C5.96086 22.7893 6.46957 23 7 23C7.31961 23 7.63009 22.916 7.90381 22.7553L12 20.2903L16.0962 22.7553C16.3699 22.916 16.6804 23 17 23C17.5304 23 18.0391 22.7893 18.4142 22.4142C18.7893 22.0391 19 21.5304 19 21V3C19 2.44772 18.5523 2 18 2H6Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Konten Kartu -->
          <div class="p-1 flex flex-col flex-grow mb-2">
            <h2
              class="text-lg font-semibold mt-2 group-hover:text-[#466543] transition-colors duration-300"
            >
              Hantu Sungai Ciliwung
            </h2>
            <div class="mt-4">
              <p
                class="text-gray-600 text-sm flex-grow leading-relaxed line-clamp-3"
              >
                “Tolong…” Sontak, mata Asih terbuka. Suara tangisan minta tolong
                itu terdengar lagi! Asih membalikkan tubuhnya, berusaha
                mengacuhkan suara itu. Gerakannya itu membuat tidur adiknya jadi
                resah. “Sst… jangan berisik, Asih,” ucap ibu yang tidur di
                samping adik. Mereka semua memang tidur berdempetan di atas
                kasur tipis. Mau bagaimana lagi, masih bagus ada atap yang
                menaungi mereka tidur. Asih hanya mengangguk pelan, tetapi tetap
                terdengar olehnya suara tangisan minta tolong di antara kecipak
                air Sungai Ciliwung. Suara minta tolong itu hanya didengar
                olehnya. Keluarganya hanya menganggap ia salah dengar. Sedangkan
                teman-temannya malah menakut-nakuti. Mereka bilang itu tangisan
                Hantu Sungai Ciliwung yang dibunuh dan jenazahnya dibuang ke
                Sungai Ciliwung bertahun-tahun lalu.
              </p>
            </div>
            <div
              class="flex flex-col sm:flex-row justify-between items-center mt-5 space-y-2 sm:space-y-0"
            >
              <!-- Profil Pengguna -->
              <div class="flex items-center space-x-3">
                <img
                  src="public/img/Ellipse 66.png"
                  alt="Profile Picture"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span class="text-gray-900 font-medium text-sm sm:text-base">
                  John Doe
                </span>
              </div>

              <!-- Tanggal -->
              <span class="text-gray-700 text-sm sm:text-base font-light">
                6 November 2022
              </span>

              <!-- Kategori -->
              <span
                class="bg-[#F0F5ED] text-[#466543] text-sm sm:text-base px-3 py-1 rounded-md"
              >
                Comedy
              </span>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="rounded-lg bg-white flex flex-col max-w-sm group">
          <!-- Gambar dan Ikon -->
          <div class="relative">
            <img
              src="https://inspiredluv.com/wp-content/uploads/2016/09/2-Beijing.jpg"
              alt="Card Image 1"
              class="rounded-t-lg group-hover:opacity-75 transition-opacity duration-300 w-full"
            />
            <!-- Ikon Bookmark -->
            <div
              class="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div
                class="bg-black text-white p-2 rounded-full shadow-md group-hover:bg-gray-800 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  class="w-6 h-6"
                >
                  <path
                    d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.5304 5.21071 22.0391 5.58579 22.4142C5.96086 22.7893 6.46957 23 7 23C7.31961 23 7.63009 22.916 7.90381 22.7553L12 20.2903L16.0962 22.7553C16.3699 22.916 16.6804 23 17 23C17.5304 23 18.0391 22.7893 18.4142 22.4142C18.7893 22.0391 19 21.5304 19 21V3C19 2.44772 18.5523 2 18 2H6Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Konten Kartu -->
          <div class="p-1 flex flex-col flex-grow mb-2">
            <h2
              class="text-lg font-semibold mt-2 group-hover:text-[#466543] transition-colors duration-300"
            >
              Hantu Sungai Ciliwung
            </h2>
            <div class="mt-4">
              <p
                class="text-gray-600 text-sm flex-grow leading-relaxed line-clamp-3"
              >
                “Tolong…” Sontak, mata Asih terbuka. Suara tangisan minta tolong
                itu terdengar lagi! Asih membalikkan tubuhnya, berusaha
                mengacuhkan suara itu. Gerakannya itu membuat tidur adiknya jadi
                resah. “Sst… jangan berisik, Asih,” ucap ibu yang tidur di
                samping adik. Mereka semua memang tidur berdempetan di atas
                kasur tipis. Mau bagaimana lagi, masih bagus ada atap yang
                menaungi mereka tidur. Asih hanya mengangguk pelan, tetapi tetap
                terdengar olehnya suara tangisan minta tolong di antara kecipak
                air Sungai Ciliwung. Suara minta tolong itu hanya didengar
                olehnya. Keluarganya hanya menganggap ia salah dengar. Sedangkan
                teman-temannya malah menakut-nakuti. Mereka bilang itu tangisan
                Hantu Sungai Ciliwung yang dibunuh dan jenazahnya dibuang ke
                Sungai Ciliwung bertahun-tahun lalu.
              </p>
            </div>
            <div
              class="flex flex-col sm:flex-row justify-between items-center mt-5 space-y-2 sm:space-y-0"
            >
              <!-- Profil Pengguna -->
              <div class="flex items-center space-x-3">
                <img
                  src="public/img/Ellipse 66.png"
                  alt="Profile Picture"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span class="text-gray-900 font-medium text-sm sm:text-base">
                  John Doe
                </span>
              </div>

              <!-- Tanggal -->
              <span class="text-gray-700 text-sm sm:text-base font-light">
                16 November 2022
              </span>

              <!-- Kategori -->
              <span
                class="bg-[#F0F5ED] text-[#466543] text-sm sm:text-base px-3 py-1 rounded-md"
              >
                Comedy
              </span>
            </div>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="rounded-lg bg-white flex flex-col max-w-sm group">
          <!-- Gambar dan Ikon -->
          <div class="relative">
            <img
              src="https://inspiredluv.com/wp-content/uploads/2016/09/2-Beijing.jpg"
              alt="Card Image 1"
              class="rounded-t-lg group-hover:opacity-75 transition-opacity duration-300"
            />
            <!-- Ikon Bookmark -->
            <div
              class="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300"
            >
              <div
                class="bg-black text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  class="w-6 h-6"
                >
                  <path
                    d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.5304 5.21071 22.0391 5.58579 22.4142C5.96086 22.7893 6.46957 23 7 23C7.31961 23 7.63009 22.916 7.90381 22.7553L12 20.2903L16.0962 22.7553C16.3699 22.916 16.6804 23 17 23C17.5304 23 18.0391 22.7893 18.4142 22.4142C18.7893 22.0391 19 21.5304 19 21V3C19 2.44772 18.5523 2 18 2H6Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Konten Kartu -->
          <div class="p-1 flex flex-col flex-grow mb-2">
            <h2
              class="text-lg font-semibold mt-2 group-hover:text-[#466543] transition-colors duration-300"
            >
              Hantu Sungai Ciliwung
            </h2>
            <div class="mt-4">
              <p
                class="text-gray-600 text-sm flex-grow leading-relaxed line-clamp-3"
              >
                “Tolong…” Sontak, mata Asih terbuka. Suara tangisan minta tolong
                itu terdengar lagi! Asih membalikkan tubuhnya, berusaha
                mengacuhkan suara itu. Gerakannya itu membuat tidur adiknya jadi
                resah. “Sst… jangan berisik, Asih,” ucap ibu yang tidur di
                samping adik. Mereka semua memang tidur berdempetan di atas
                kasur tipis. Mau bagaimana lagi, masih bagus ada atap yang
                menaungi mereka tidur. Asih hanya mengangguk pelan, tetapi tetap
                terdengar olehnya suara tangisan minta tolong di antara kecipak
                air Sungai Ciliwung. Suara minta tolong itu hanya didengar
                olehnya. Keluarganya hanya menganggap ia salah dengar. Sedangkan
                teman-temannya malah menakut-nakuti. Mereka bilang itu tangisan
                Hantu Sungai Ciliwung yang dibunuh dan jenazahnya dibuang ke
                Sungai Ciliwung bertahun-tahun lalu.
              </p>
            </div>
            <div
              class="flex flex-col sm:flex-row justify-between items-center mt-5 space-y-2 sm:space-y-0"
            >
              <!-- Profil Pengguna -->
              <div class="flex items-center space-x-3">
                <img
                  src="public/img/Ellipse 66.png"
                  alt="Profile Picture"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span class="text-gray-900 font-medium text-sm sm:text-base">
                  John Doe
                </span>
              </div>

              <!-- Tanggal -->
              <span class="text-gray-700 text-sm sm:text-base font-light">
                16 November 2022
              </span>

              <!-- Kategori -->
              <span
                class="bg-[#F0F5ED] text-[#466543] text-sm sm:text-base px-3 py-1 rounded-md"
              >
                Comedy
              </span>
            </div>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="rounded-lg bg-white flex flex-col max-w-sm group">
          <!-- Gambar dan Ikon -->
          <div class="relative group">
            <img
              src="https://inspiredluv.com/wp-content/uploads/2016/09/2-Beijing.jpg"
              alt="Card Image 1"
              class="rounded-t-lg group-hover:opacity-75 transition-opacity duration-300"
            />
            <!-- Ikon Bookmark -->
            <div
              class="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300"
            >
              <div
                class="bg-black text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  class="w-6 h-6"
                >
                  <path
                    d="M6 2C5.44772 2 5 2.44772 5 3V21C5 21.5304 5.21071 22.0391 5.58579 22.4142C5.96086 22.7893 6.46957 23 7 23C7.31961 23 7.63009 22.916 7.90381 22.7553L12 20.2903L16.0962 22.7553C16.3699 22.916 16.6804 23 17 23C17.5304 23 18.0391 22.7893 18.4142 22.4142C18.7893 22.0391 19 21.5304 19 21V3C19 2.44772 18.5523 2 18 2H6Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Konten Kartu -->
          <div class="p-1 flex flex-col flex-grow mb-2">
            <h2
              class="text-lg font-semibold mt-2 group-hover:text-[#466543] transition-colors duration-300"
            >
              Hantu Sungai Ciliwung
            </h2>
            <div class="mt-4">
              <p
                class="text-gray-600 text-sm flex-grow leading-relaxed line-clamp-3"
              >
                “Tolong…” Sontak, mata Asih terbuka. Suara tangisan minta tolong
                itu terdengar lagi! Asih membalikkan tubuhnya, berusaha
                mengacuhkan suara itu. Gerakannya itu membuat tidur adiknya jadi
                resah. “Sst… jangan berisik, Asih,” ucap ibu yang tidur di
                samping adik. Mereka semua memang tidur berdempetan di atas
                kasur tipis. Mau bagaimana lagi, masih bagus ada atap yang
                menaungi mereka tidur. Asih hanya mengangguk pelan, tetapi tetap
                terdengar olehnya suara tangisan minta tolong di antara kecipak
                air Sungai Ciliwung. Suara minta tolong itu hanya didengar
                olehnya. Keluarganya hanya menganggap ia salah dengar. Sedangkan
                teman-temannya malah menakut-nakuti. Mereka bilang itu tangisan
                Hantu Sungai Ciliwung yang dibunuh dan jenazahnya dibuang ke
                Sungai Ciliwung bertahun-tahun lalu.
              </p>
            </div>
            <div
              class="flex flex-col sm:flex-row justify-between items-center mt-5 space-y-2 sm:space-y-0"
            >
              <!-- Profil Pengguna -->
              <div class="flex items-center space-x-3">
                <img
                  src="public/img/Ellipse 66.png"
                  alt="Profile Picture"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span class="text-gray-900 font-medium text-sm sm:text-base">
                  John Doe
                </span>
              </div>

              <!-- Tanggal -->
              <span class="text-gray-700 text-sm sm:text-base font-light">
                16 November 2022
              </span>

              <!-- Kategori -->
              <span
                class="bg-[#F0F5ED] text-[#466543] text-sm sm:text-base px-3 py-1 rounded-md"
              >
                Comedy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Button -->
    <div class="flex space-x-3 mt-10" style="margin-left: 450px">
      <!-- Page 1 Button -->
      <button
        class="px-4 py-2 bg-[#466543] text-white text-sm font-bold rounded-md"
      >
        1
      </button>
      <!-- Page 2 Button -->
      <button
        class="px-4 py-2 bg-[#F0F5ED] text-[#222222] text-sm font-bold rounded-md hover:bg-[#466543] hover:text-white"
      >
        2
      </button>
      <!-- Next Button -->
      <button
        class="px-4 py-2 bg-[#F0F5ED] text-[#222222] text-sm font-bold rounded-md hover:bg-[#466543] hover:text-white"
      >
        Next
      </button>
    </div>

    <div
      class="border-t w-full border-gray-300 pt-4 text-gray-600 text-sm flex justify-between items-center"
      style="margin-top: 80px"
    >
      <div style="margin-left: 90px">
        <p>© 2024 PT. Timedoor Indonesia. All rights reserved.</p>
      </div>
      <div class="flex space-x-4" style="margin-right: 80px">
        <a href="#" class="hover:text-gray-900">
          <img
            src="public/img/Icon Social Media.png"
            alt="Facebook"
            class="w-6 h-6"
          />
        </a>
        <a href="#" class="hover:text-gray-900">
          <img
            src="public/img/Icon Social Media (1).png"
            alt="Instagram"
            class="w-6 h-6"
          />
        </a>
        <a href="#" class="hover:text-gray-900">
          <img
            src="public/img/Icon Social Media (2).png"
            alt="YouTube"
            class="w-8 h-6"
          />
        </a>
      </div>
    </div>
  </main>
</template>
