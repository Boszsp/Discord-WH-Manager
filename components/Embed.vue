<script setup>
import colors from "vuetify/util/colors";
const props = defineProps({
  data: Object,
});
</script>
<template>
  <v-sheet rounded class="bg-background-secondary rounded overflow-hidden">
    <div class="border-l-4 px-2 border-primary" :style="{'border-color':data?.color}">
      <div class="p-2">
        <a class="author flex items-center gap-2" :href="props?.data?.author?.url">
          <v-avatar v-if="props?.data?.author?.icon_url" :image="props?.data?.author?.icon_url" size="24"></v-avatar>
          <p class="font-bold text-xs">{{ data?.author?.name }}</p>
          <v-avatar v-if="data?.author?.name" image="" size="24"></v-avatar>
        </a>
        <p class="title font-bold mt-2">{{ props?.data?.title }}</p>
        <p class="text-sm">{{ props?.data?.description }}</p>
        <div class="fields grid"></div>
        <div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>
