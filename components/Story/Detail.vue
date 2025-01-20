<script setup>
// State untuk dropdown user
const isDropdownOpen = ref(false);
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

function openModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

const props = defineProps({
    storiesId: {
        type: String,
        required: true
    }
});

console.log(props.storiesId);

const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <Header />

        <!-- Breadcrumb -->
        <nav class="bg-[#F0F5ED] py-6">
            <div class="container mx-auto text-sm text-[#466543] ml-12">
                <NuxtLink to="/" class="relative inline-block group">
                    Home
                    <span
                        class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"></span>
                </NuxtLink>
                <span class="mx-2">/</span>
                <div to="/" class="relative inline-block group">
                    Detail
                </div>
                <span class="mx-2">/</span>
                <NuxtLink to="#" class="relative inline-block group">
                    {{ storiesId.title }}
                    <span
                        class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-[#466543] transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"></span>
                </nuxtLink>
            </div>
        </nav>

        <!-- Content -->
        <main class="container mx-auto px-4 py-8">
            <div class="text-center">
                <!-- Tanggal -->
                <p class="text-[#4B4B4B] text-[Quartz] mb-6">15 May 2023</p>
                <!-- Judul -->
                <h1 class="text-4xl font-bold text-[Raisin Black] mb-8">
                    {{ storiesId.title }}
                </h1>
                <!-- Penulis -->
                <div class="flex justify-center items-center space-x-2 text-[#222222]">
                    <img src="public/img/Ellipse 66 (4).png" alt="Author" class="w-6 h-6 rounded-full" />
                    <span class="font-medium">{{ storiesId.user }}</span>
                </div>
            </div>
        </main>

        <!-- Main Content -->
        <div class="ml-24 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Image Section -->
            <div class="col-span-1">
                <div class="relative w-full rounded-lg shadow-md overflow-hidden">
                    <div class="relative w-full h-0" style="
              padding-top: 125%;
              background-image: url('https://e0.pxfuel.com/wallpapers/513/594/desktop-wallpaper-namsan-tower-seoul-korea-fotografi-korea-selatan-fotografi.jpg');
              background-size: cover;
              background-position: center;
            " onclick="document.getElementById('modal').classList.remove('hidden')">
                        <!-- Tombol Panah Kiri -->
                        <button
                            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-transparent text-white rounded-full p-2"
                            aria-label="Previous">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <!-- Tombol Panah Kanan -->
                        <button
                            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent text-white rounded-full p-1"
                            aria-label="Next">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <div class="ml-24 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="col-span-1">
                                <!-- <div v-if="images.length"
                                    class="relative w-full rounded-lg shadow-md overflow-hidden cursor-pointer"
                                    @click="handleOpenModal(images[0])">
                                    <div class="relative w-full h-64 bg-cover bg-center"
                                        :style="{ backgroundImage: url('${images[0]}') }">
                                    </div>
                                </div> -->

                                <!-- Modal -->
                                <div v-if="isModalOpen"
                                    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl">
                                        <div class="relative flex justify-end p-8">
                                            <button
                                                class="absolute top-4 right-4 bg-[#466543] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#3B4F3A]"
                                                @click="handleCloseModal">
                                                ✕
                                            </button>
                                        </div>
                                        <div class="relative w-full max-w-3xl h-96 bg-cover bg-center mx-auto"
                                            :style="{ backgroundImage: url('${modalImage}') }"></div>
                                    </div>
                                </div>

                                <!-- Thumbnails -->
                                <div
                                    class="flex items-center justify-center h-30 mt-4 gap-2 overflow-x-auto rounded-lg">
                                    <div v-for="(image, index) in images" :key="index"
                                        class="w-20 h-20 rounded-lg shrink-0 cursor-pointer"
                                        :style="{ backgroundImage: url('${image}') }" @click="handleOpenModal(image)">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Text Content -->
            <div class="col-span-2 px-6 rounded-lg">
                <div class="text-gray-800 leading-7">
                    {{ storiesId.content }}
                </div>

                <!-- <div class="mt-4 text-gray-800 leading-7">
                    As Rocket lies unconscious, he recalls his past. As a baby raccoon, he
                    was experimented on by the High Evolutionary, a scientist who sought
                    to enhance and anthropomorphize animal lifeforms to create a
                    Counter-Earth. Rocket befriended the High Evolutionary's other test
                    subjects: the otter Lylla, the walrus Teefs, and the rabbit Floor. The
                    High Evolutionary was impressed by Rocket's intelligence but furious
                    that it exceeded his own. The High Evolutionary perfected his
                    experiments with Rocket's advice but ordered Rocket's brain to be
                    extracted and his friends incinerated. Rocket freed Lylla, only for
                    the High Evolutionary to kill her. Rocket mauled the High Evolutionary
                    and shot his guards, but Teefs and Floor were killed in the chaos.
                    Alone, Rocket stole a spaceship and fled.
                </div>

                <div class="mt-4 text-gray-800 leading-7">
                    In the present, the alternate version of Gamora,[c] who has joined the
                    Ravagers, helps the Guardians infiltrate Orgocorp. They retrieve
                    Rocket's file but discover that the code has been removed. The group
                    speculates that Theel, one of the High Evolutionary's advisors, has
                    it, so they depart for Counter-Earth. They are followed by Ayesha and
                    Adam, who are ordered by their creator, the High Evolutionary, to
                    retrieve Rocket for his brain.
                </div>

                <div class="mt-4 text-gray-800 leading-7">
                    Upon arriving, the team is helped by residents in tracing Theel to the
                    High Evolutionary's ship. Drax and Mantis remain with Gamora and
                    Rocket as Peter Quill, Groot, and Nebula travel to the High
                    Evolutionary's ship. Nebula is forced to wait outside by guards as
                    Quill and Groot board. Drax and Mantis pursue Quill's group.
                </div>

                <div class="mt-4 text-gray-800 leading-7">
                    The High Evolutionary initiates his destruction and planned recreation
                    of Counter-Earth, which kills all life on the planet, including
                    Ayesha. As his ship enters orbit, Quill and Groot leap off and kill
                    Theel, retrieving the code from him. Gamora arrives with their ship to
                    rescue them, while Nebula, Mantis, and Drax board the High
                    Evolutionary's ship to escape the planet. As Quill's group attempts to
                    access the code, Rocket flatlines and has a near-death experience,
                    where he reunites with Lylla, Teefs, and Floor. Lylla tells him that
                    his time has not yet come as Quill uses the code to disable the kill
                    switch and save Rocket's life.
                </div>

                <div class="mt-4 text-gray-800 leading-7">
                    Nebula, Mantis, and Drax come across hundreds of imprisoned humanoid
                    children on the High Evolutionary's ship before being captured.
                    Quill's group sets out to rescue the three, who are placed in a
                    chamber with monstrous Abilisks. Mantis befriends the Abilisks,
                    allowing the group to escape and reunite with Quill's group, together
                    overpowering the High Evolutionary's army. Kraglin and Cosmo arrive on
                    Knowhere, and Cosmo creates a telekinetic tunnel connecting Knowhere
                    to the High Evolutionary's ship to free the captured children. Rocket
                    discovers imprisoned animals on the ship before being attacked by the
                    High Evolutionary, but the rest of the Guardians help subdue him,
                    leaving him to perish on his ship. The Guardians rescue the animals
                    and lead them aboard Knowhere. Quill nearly dies trying to cross over
                    but is saved by Adam, who had a change of heart after being saved by
                    Groot.
                </div>

                <div class="mt-4 text-gray-800 leading-7">
                    In the aftermath, Quill leaves the Guardians, bestowing the captaincy
                    to Rocket before leaving for Earth to reunite with his grandfather
                    Jason. Mantis embarks on a journey of self-discovery with the
                    Abilisks, Gamora reunites with the Ravagers, and Nebula and Drax
                    remain on Knowhere to raise the rescued children. In a mid-credits
                    scene, the new Guardians, consisting of Rocket, Groot, Cosmo, Kraglin,
                    Adam, Phyla (one of the rescued children), and Adam's pet Blurp, take
                    on a new mission. In a post-credits scene, Quill eats breakfast with
                    Jason.
                </div> -->
            </div>
        </div>
        <div class="p-24 mt-28">
            <h2 class="text-2xl font-serif font-semibold mb-6">Similar Story</h2>
            <hr class="border-b border-gray-200 mb-8" />
            <div class="overflow-x-scroll scrollbar-hide gap-6 py-2 flex">
                <!-- Card 1 -->
                <div class="flex-shrink-0 w-2/6 rounded-lg relative group">
                    <div class="relative inline-block">
                        <!-- Gambar -->
                        <img src="https://lp-cms-production.imgix.net/2019-06/508510369_super.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4"
                            alt="picture"
                            class="w-full h-74 object-cover group-hover:opacity-75 transition-opacity duration-300" />

                        <!-- Ikon Bookmark -->
                        <div
                            class="absolute bottom-5 right-5 bg-[#4C6248] w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v16l7-5 7 5V3z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 9h4m-2-2v4" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold text-black mt-1">Gemma</h3>
                        <p class="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                            1. GOLDEN Gemma was only five minutes away from her parents' hut,
                            but the jungle had already taken on a different personality. It
                            was thicker. The trees had grown taller. The ti plants shaded the
                            green forest a sinister red. There was no doubt about it- the
                            jungle was more dangerous here, and Gemma loved it. As a baby,
                            Gemma's parents had taken her on their expeditions over mountains,
                            deserts, and vast seas. It was exciting, unpredictable, and deeply
                            irresponsible. Now that they had settled down in the tropical
                            rainforest, Gemma had to devise intricate plans just to sneak out
                            for morning adventures.
                        </p>
                        <div class="flex items-center justify-between mt-4 text-sm">
                            <div class="flex items-center gap-2">
                                <img src="public/img/Ellipse 66.png" alt="Avatar" class="w-8 h-8 rounded-full" />
                                <span class="text-gray-800 font-medium">Khrisvana (updated) 1</span>
                            </div>
                            <div class="flex gap-2 items-center">
                                <span class="text-gray-500">12 March 2024</span>
                                <span class="bg-[#F6F8F4] text-[#4C6248] px-3 py-1 rounded-md">
                                    Comedy
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 2 -->
                <div class="flex-shrink-0 w-2/6 rounded-lg relative group">
                    <div class="relative inline-block">
                        <!-- Gambar -->
                        <img src="https://bestcityscape.com/wp-content/uploads/2018/10/DJICN18_004522.jpg" alt="picture"
                            class="w-full h-74 object-cover group-hover:opacity-75 transition-opacity duration-300"
                            style="margin-right: 100px" />

                        <!-- Ikon Bookmark -->
                        <div
                            class="absolute bottom-5 right-5 bg-[#4C6248] w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v16l7-5 7 5V3z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 9h4m-2-2v4" />
                            </svg>
                        </div>
                    </div>

                    <div class="p-1">
                        <h3 class="text-lg font-bold text-black mt-1">
                            Harry Potter and the Goblet of Fire
                        </h3>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                            Harry Potter and the Goblet of Fire is a fantasy novel written by
                            British author J. K. Rowling and the fourth novel in the Harry
                            Potter series. It follows Harry Potter, a wizard in his fourth
                            year at Hogwarts School of Witchcraft and Wizardry, and the
                            mystery surrounding the entry of Harry's name into the Triwizard
                            Tournament, in which he is forced to compete. The book was
                            published in the United Kingdom by Bloomsbury and in the United
                            States by Scholastic. In both countries, the release date was 8
                            July 2000. This was the first time a book in the series was
                            published in both countries at the same time. The novel won a Hugo
                            Award, the only Harry Potter novel to do so, in 2001. The book was
                            adapted into a film, released worldwide on 18 November 2005, and a
                            video game by Electronic Arts.
                        </p>
                        <div class="flex items-center justify-between mt-4 text-sm">
                            <div class="flex items-center gap-2">
                                <img src="public/img/Ellipse 66 (1).png" alt="Avatar" class="w-8 h-8 rounded-full" />
                                <span class="text-gray-800 font-medium">Kim Jong In</span>
                            </div>
                            <div class="flex gap-2 items-center">
                                <span class="text-gray-500">17 July 2023</span>
                                <span class="bg-[#F6F8F4] text-[#4C6248] px-3 py-1 rounded-md">
                                    Romance
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 3 -->
                <div class="flex-shrink-0 w-2/6 rounded-lg relative group">
                    <div class="relative inline-block">
                        <!-- Gambar -->
                        <img src="https://bestcityscape.com/wp-content/uploads/2018/10/CN8_4617_00001.jpg" alt="picture"
                            class="w-full h-74 object-cover mx-42 group-hover:opacity-75 transition-opacity duration-300" />

                        <!-- Ikon Bookmark -->
                        <div
                            class="absolute bottom-5 right-5 bg-[#4C6248] w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v16l7-5 7 5V3z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 9h4m-2-2v4" />
                            </svg>
                        </div>
                    </div>

                    <div class="p-1">
                        <h3 class="text-lg font-bold text-black mt-1">
                            Harry Potter and the Chamber of Secrets
                        </h3>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                            Harry Potter and the Chamber of Secrets is a fantasy novel written
                            by British author J. K. Rowling and the second novel in the Harry
                            Potter series. The plot follows Harry's second year at Hogwarts
                            School of Witchcraft and Wizardry, during which a series of
                            messages on the walls of the school's corridors warn that the
                            "Chamber of Secrets" has been opened and that the "heir of
                            Slytherin" would kill all pupils who do not come from all-magical
                            families. These threats are found after attacks that leave
                            residents of the school petrified. Throughout the year, Harry and
                            his friends Ron and Hermione investigate the attacks. The book was
                            published in the United Kingdom on 2 July 1998 by Bloomsbury and
                            later in the United States on 2 June 1999 by Scholastic Inc.
                            Although Rowling says she found it difficult to finish the book,
                            it won high praise and awards from critics, young readers, and the
                            book industry, although some critics thought the story was perhaps
                            too frightening for younger children. Much like with other novels
                            in the series, Harry Potter and the Chamber of Secrets triggered
                            religious debates; some religious authorities have condemned its
                            use of magical themes, whereas others have praised its emphasis on
                            self-sacrifice and the way one's character is the result of one's
                            choices. Several commentators have noted that personal identity is
                            a strong theme in the book and that it addresses issues of racism
                            through the treatment of non-human, non-magical, and non-living
                            people. Some commentators regard the story's diary that writes
                            back as a warning against uncritical acceptance of information
                            from sources whose motives and reliability cannot be checked.
                            Institutional authority is portrayed as self-serving and
                            incompetent. The film adaptation of the novel, released in 2002,
                            became (at the time) the sixth highest-grossing film ever and
                            received generally favourable reviews. Video games loosely based
                            on Harry Potter and the Chamber of Secrets were also released for
                            several platforms, and most obtained favourable reviews.
                        </p>
                        <div class="flex items-center justify-between mt-4 text-sm">
                            <div class="flex items-center gap-2">
                                <img src="public/img/Ellipse 66 (1).png" alt="Avatar" class="w-8 h-8 rounded-full" />
                                <span class="text-gray-800 font-medium">Kim Jong In</span>
                            </div>
                            <div class="flex gap-2 items-center">
                                <span class="text-gray-500">17 July 2023</span>
                                <span class="bg-[#F6F8F4] text-[#4C6248] px-3 py-1 rounded-md">
                                    Horror
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 4 -->
                <div class="flex-shrink-0 w-2/6 rounded-lg relative group">
                    <div class="relative inline-block">
                        <!-- Gambar -->
                        <img src="https://i.pinimg.com/originals/22/1b/ce/221bceab55ab657a718c12b282bb5f11.jpg"
                            alt="picture"
                            class="w-full h-74 object-cover mx-42 group-hover:opacity-75 transition-opacity duration-300"
                            style="margin-right: 200px" />

                        <!-- Ikon Bookmark -->
                        <div
                            class="absolute bottom-5 right-5 bg-[#4C6248] w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v16l7-5 7 5V3z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold text-black mt-1">
                            Harry Potter and the Philosopher's Stone
                        </h3>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                            Harry Potter and the Philosopher's Stone is a fantasy novel
                            written by British author J. K. Rowling. The first novel in the
                            Harry Potter series and Rowling's debut novel, it follows Harry
                            Potter, a young wizard who discovers his magical heritage on his
                            eleventh birthday, when he receives a letter of acceptance to
                            Hogwarts School of Witchcraft and Wizardry. Harry makes close
                            friends and a few enemies during his first year at the school and
                            with the help of his friends, Ron Weasley and Hermione Granger, he
                            faces an attempted comeback by the dark wizard Lord Voldemort, who
                            killed Harry's parents, but failed to kill Harry when he was just
                            15 months old.
                        </p>
                        <div class="flex items-center justify-between mt-4 text-sm">
                            <div class="flex items-center gap-2">
                                <img src="public/img/Ellipse 66 (1).png" alt="Avatar" class="w-8 h-8 rounded-full" />
                                <span class="text-gray-800 font-medium">Kim Jong In</span>
                            </div>
                            <div class="flex gap-2 items-center">
                                <span class="text-gray-500">14 July 2023</span>
                                <span class="bg-[#F6F8F4] text-[#4C6248] px-3 py-1 rounded-md">
                                    Horror
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 5 -->
                <div class="flex-shrink-0 w-2/6 rounded-lg relative group">
                    <div class="relative inline-block">
                        <!-- Gambar -->
                        <img src="https://wallpapercave.com/wp/wp2328794.jpg" alt="picture"
                            class="w-full h-74 object-cover mx-42 group-hover:opacity-75 transition-opacity duration-300"
                            style="margin-right: 200px" />

                        <!-- Ikon Bookmark -->
                        <div
                            class="absolute bottom-5 right-5 bg-[#4C6248] w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v16l7-5 7 5V3z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold text-black mt-1">Spring in London</h3>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                            Danny Jo adalah model yang sedang belajar menjadi sutradara, ia
                            memiliki kakak perempuan bernama Anna Jo, yang dulunya model juga
                            tetapi sudah mulai mundur. Danny Jo adalah keturunan Korea, nama
                            aslinya Jo In-Ho, sebenarnya dia juga punya kakak laki-laki yang
                            bernama Jo Seung-Ho tetapi sudah meninggal 2 tahun karena
                            kecelakaan akibat mabuk. Danny Jo yang bersahabat dengan Jung Tae
                            Woo seorang penyanyi (pemeran utama di novel Summer in Seoul)
                            memintanya menjadi model MVnya yang syuting di London. Di London
                            Naomi Ishida yang seorang model yang sangat sibuk tinggal 1 Flat
                            dengan Julie (anak orang kaya yang sedang terjun kedunia teater)
                            dan Chris (koki namun gay). Naomi tipe orang yang tidak suka
                            tempat yang sunyi, tetapi juga tak suka keramaian. Ia membintangi
                            MV seorang penyanyi Korea yang tak lain TaeWoo. Di lokasi ia
                            seperti orang bingung karena ia tak mengerti Korea seperti kru
                            lain hanya sutradara & penata rias (Yoon) nya yang bisa bahasa
                            Inggris. Yoon memberi tahu Naomi bahwa pasangnya adalah Danny Jo
                            yang membuat Naomi kaget. Saat bertemu pun Naomi sangat takut
                            namun menutupinya walau terbaca oleh Danny, hal itu membuat Danny
                            bingung. Walau Danny & Naomi pasangan di MV tersebut tetapi mereka
                            syuting bersama hanya pada hari ke-3, hari terakhir syuting. 2
                            hari awal Danny hanya membantu Sutradara Shin (sutradara terkenal
                            Korea) sekaligus untuk belajar menjadi sutradara. Danny mendekati
                            Naomi yang selalu membuatnya penasaran. Naomi pernah hampir
                            pingsan setelah izin pergi saat break makan siang. Naomi seorang
                            yang takut sepi tetapi saat pulang malam ia tak mau diantar hingga
                            Danny harus mengikutinya diam-diam hingga Flat Naomi. Dihari
                            terakhir mereka syuting, Naomi diajak Danny pergi ke taman kecil
                            sekaligus menunggu syuting siang hari. Hal itu menjadikan mereka
                            dekat walau Naomi sempat ragu. Miho teman Naomi kembali dari
                            Korea, Miho mendapat titipan Gingseng dari ibu temannya yang
                            ternyata pria itu adalah Danny Jo.
                        </p>
                        <div class="flex items-center justify-between mt-4 text-sm">
                            <div class="flex items-center gap-2">
                                <img src="public/img/Ellipse 66 (1).png" alt="Avatar"
                                    class="w-8 h-8 rounded-full group-hover:opacity-75 transition-opacity duration-300" />
                                <span class="text-gray-800 font-medium">Kim Jong In</span>
                            </div>
                            <div class="flex gap-2 items-center">
                                <span class="text-gray-500">05 July 2023</span>
                                <span class="bg-[#F6F8F4] text-[#4C6248] px-3 py-1 rounded-md">
                                    Horror
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 6 -->
                <div class="flex-shrink-0 w-2/6 rounded-lg relative group">
                    <div class="relative inline-block">
                        <!-- Gambar -->
                        <img src="https://i.misteraladin.com/blog/2015/05/22102516/Seoul.jpg" alt="picture"
                            class="w-full h-74 object-cover mx-42 group-hover:opacity-75 transition-opacity duration-300"
                            style="margin-right: 200px" />

                        <!-- Ikon Bookmark -->
                        <div
                            class="absolute bottom-5 right-5 bg-[#4C6248] w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-[#3B4F3A] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v16l7-5 7 5V3z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold text-black mt-1">Autumn in Paris</h3>
                        <p class="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
                            Tara Dupont menyukai Paris dan musim gugur. Ia mengira sudah
                            memiliki segalanya dalam hidup sampai ia bertemu Tatsuya Fujisawa
                            yang susah ditebak dan selalu membangkitkan rasa penasarannya
                            sejak awal. Tatsuya Fujisawa benci Paris dan musim gugur. Ia
                            datang ke Paris untuk mencari orang yang menghancurkan hidupnya.
                            Namun ia tidak menduga akan terpesona pada Tara Dupont, gadis yang
                            cerewet tetapi bisa menenangkan jiwa dan pikirannya, juga mengubah
                            dunianya. Tara maupun Tatsuya sama sekali tidak menyadari benang
                            yang menghubungkan mereka dengan masa lalu, adanya rahasia yang
                            menghancurkan segala harapan, perasaan, dan keyakinan. Ketika
                            kebenaran terungkap, tersingkap pula arti putus asa, arti tak
                            berdaya. Kenyataan juga begitu menyakitkan hingga mendorong salah
                            satu dari mereka ingin mengakhiri hidup.
                        </p>
                        <div class="flex items-center justify-between mt-4 text-sm">
                            <div class="flex items-center gap-2">
                                <img src="public/img/Ellipse 66 (1).png" alt="Avatar" class="w-8 h-8 rounded-full" />
                                <span class="text-gray-800 font-medium">Kim Jong In</span>
                            </div>
                            <div class="flex gap-2 items-center">
                                <span class="text-gray-500">05 July 2023</span>
                                <span class="bg-[#F6F8F4] text-[#4C6248] px-3 py-1 rounded-md">
                                    Horror
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
    </div>
</template>