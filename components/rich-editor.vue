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

// Konfigurasi CKEditor dengan tinggi lebih panjang
const editorConfig = {
    placeholder: "Enter a content here",
    height: 100, // Menyesuaikan tinggi editor
    toolbar: [
        "heading",
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
            { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
            { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
            { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
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

<style>
.ck-editor__editable {
    min-height: 100px !important;
    /* Mengatur tinggi minimum editor */
}

.ck.ck-toolbar {
    border-bottom: none !important;
}

.ck-editor__editable {
    border-top: 1px solid transparent !important;
}

.ck.ck-toolbar__separator {
    display: none !important;
}

</style>
