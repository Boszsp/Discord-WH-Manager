<script setup>
import {QuillEditor} from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
const val = defineModel();
const props = defineProps({title: String});
const emit = defineEmits(["update"]);
</script>

<template>
  <ClientOnly>
    <div>
      <p class="text-sm opacity-70">{{ props?.title }}</p>
      <div class="bg-component-background">
        <QuillEditor @update:content="(c) => emit('update', c)" rows="5" v-model:content="val" contentType="html" theme="snow" />
      </div>
    </div>
  </ClientOnly>
</template>
