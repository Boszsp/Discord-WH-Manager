<script setup>
const props = defineProps({
  author: Object,
  avatarURL: String,
  content: String,
});
</script>
<template>
  <v-sheet rounded class="bg-background-secondary rounded overflow-hidden">
    <div class="flex">
      <span class="w-1" :style="{ background: 'red' }" vertical></span>
      <span class="p-2">
        <div class="author">
          <b><sub>Author</sub></b>
        </div>
        <p class="title font-bold mt-2">title</p>
        <p class="text-sm">contentไลน์</p>
        <div class="fields grid"></div>
      </span>
    </div>
  </v-sheet>
</template>
