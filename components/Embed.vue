<script setup>
const img = useImage();
const props = defineProps({
  data: Object,
});
const emit = defineEmits(["delete"]);
</script>
<template>
  <div class="flex">
    <v-sheet rounded class="bg-background-secondary rounded overflow-hidden">
      <div class="border-l-4 px-2 border-primary flex overflow-hidden" :style="{'border-color': data?.color}">
        <span :class="'p-2 flex flex-col ' + (props?.data?.thumbnail?.url ? 'w-10/12' : 'w-full')">
          <a class="author flex items-center gap-2" :href="props?.data?.author?.url">
            <v-avatar v-if="props?.data?.author?.icon_url" :image="img(props?.data?.author?.icon_url, {format: 'webp'})" size="24"></v-avatar>
            <p class="font-bold text-sm">{{ data?.author?.name }}</p>
            <v-avatar v-if="data?.author?.name" image="" size="24"></v-avatar>
          </a>
          <a :href="props?.data?.url" class="title font-bold mt-2">{{ props?.data?.title }}</a>
          <div class="text-sm" v-html="props?.data?.description?.replaceAll('\n', '<br/>')"></div>
          <div class="fields">
            <EmbedFields :fields="props?.data?.fields" />
          </div>
          <div v-if="props?.data?.image?.url" class="images mt-2">
            <NuxtImg class="rounded" :src="props?.data?.image?.url" />
          </div>
          <div class="footer mt-2 flex items-center gap-2 text-xs">
            <v-avatar v-if="props?.data?.footer?.icon_url" :image="img(props?.data?.footer?.icon_url, {format: 'webp'})" size="24"></v-avatar>
            <div class="footer flex items-center gap-1">
              <p>{{ props?.data?.footer?.text }}</p>
              <div v-if="props?.data?.timestamp && props?.data?.footer?.text" class="h-1 w-1 rounded-full bg-component-background"></div>
              <p>{{ props?.data?.timestamp }}</p>
            </div>
          </div>
        </span>
        <span class="'p-4 pl-2 w-2/12" v-if="props?.data?.thumbnail?.url">
          <NuxtImg class="rounded" :src="props?.data?.thumbnail?.url" />
        </span>
      </div>
    </v-sheet>
    <span>
      <v-btn @click="(e) => emit('delete', e)" size="x-small" variant="text" icon="mdi-close" color="" class="p-2"></v-btn>
    </span>
  </div>
</template>
