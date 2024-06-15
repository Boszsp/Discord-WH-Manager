<script setup>
const img = useImage();

const props = defineProps({
  username: String,
  avatarURL: String,
  content: String,
});
</script>
<template>
  <div class="flex gap-2">
    <span>
      <v-avatar :image="img(props.avatarURL ?? '/discord1.png', {format: 'webp'})" size="36"></v-avatar>
    </span>
    <span>
      <div class="flex gap-1 items-center flex-wrap">
        <p class="font-bold">{{ props?.username?.length > 0 ? props.username : "Captain Hook" }}</p>
        <span class="flex items-center">
          <span class="font-bold bg-primary text-white text-xs px-2 rounded">App</span>
        </span>
        <sub>{{ new Date().toLocaleString("th") }}</sub>
      </div>
      <div>
        <p>{{ props.content }}</p>
        <slot />
      </div>
    </span>
  </div>
</template>
