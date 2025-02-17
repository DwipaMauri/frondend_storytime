<template>
    <client-only>
        <ckeditor v-if="editorLoaded" :editor="editor" v-model="content" :config="editorConfig" @input="updateContent">
        </ckeditor>
    </client-only>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";

const props = defineProps({
    modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);
const editor = ref(null);
const editorLoaded = ref(false);
const content = ref(props.modelValue);

// Konfigurasi CKEditor dengan Dropdown "Normal"
const editorConfig = {
    placeholder: "Enter a content here",
    toolbar: [
        "heading",  // Dropdown untuk memilih "Normal", "Heading 1", "Heading 2", dll.
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "|",
        "alignment",
        "fontSize",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "indent",
        "outdent",
        "|",
        "undo",
        "redo",
    ],
    heading: {
        options: [
            { model: "paragraph", title: "Normal", class: "ck-heading_paragraph" },
            { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
            { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
            { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
        ],
    },
    image: {
        toolbar: ["imageStyle:full", "imageStyle:side", "|", "imageTextAlternative"],
    },
    mediaEmbed: {
        previewsInData: true,
    },
};

const updateContent = (event) => {
    emit("update:modelValue", event);
};

// Sinkronisasi perubahan dari parent
watch(
    () => props.modelValue,
    (newValue) => {
        content.value = newValue;
    }
);

onMounted(async () => {
    try {
        const { default: ClassicEditor } = await import("@ckeditor/ckeditor5-build-classic");
        editor.value = ClassicEditor;
        editorLoaded.value = true;
    } catch (error) {
        console.error("Error loading CKEditor:", error);
    }
});
</script>
