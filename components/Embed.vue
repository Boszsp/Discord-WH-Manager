<script setup>
const img = useImage();
const props = defineProps({
  data: Object,
});
</script>
<template>
  <v-sheet rounded class="bg-background-secondary rounded overflow-hidden">
    <div class="border-l-4 px-2 border-primary" :style="{'border-color': data?.color}">
      <div class="p-2 flex flex-col">
        <a class="author flex items-center gap-2" :href="props?.data?.author?.url">
          <v-avatar v-if="props?.data?.author?.icon_url" :image="img(props?.data?.author?.icon_url, {format: 'webp'})" size="24"></v-avatar>
          <p class="font-bold text-xs">{{ data?.author?.name }}</p>
          <v-avatar v-if="data?.author?.name" image="" size="24"></v-avatar>
        </a>
        <a :href="props?.data?.url" class="title font-bold mt-2">{{ props?.data?.title }}</a>
        <p class="text-sm">{{ props?.data?.description }}</p>
        <div class="fields grid"></div>
        <div v-if="props?.data?.image?.url" class="images mt-2">
          <NuxtImg class="rounded" :src="props?.data?.image?.url" />
        </div>
        <div class="footer mt-2 flex items-center gap-2">
          <v-avatar v-if="props?.data?.footer?.icon_url" :image="img(props?.data?.footer?.icon_url, {format: 'webp'})" size="24"></v-avatar>
          <div class="footer mt-2 flex items-center gap-1">
            <p class="text-sm">{{ props?.data?.footer?.text }}</p>
            <div v-if="props?.data?.footer?.timestamp" class="h-2 w-2 rounded-full bg-component-background"></div>
            <p class="text-sm">{{ props?.data?.footer?.timestamp }}</p>
          </div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>
