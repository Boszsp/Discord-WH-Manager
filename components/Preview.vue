<script setup>
import sanitizeHtml from "sanitize-html";

const img = useImage();
const now_date = useState(() => new Date().toLocaleString("th"));

const props = defineProps({
  username: String,
  avatarURL: String,
  content: String,
  timestamp: String,
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
          <span class="font-bold bg-primary text-white text-xs px-1 rounded">App</span>
        </span>
        <sub>{{ timestamp || now_date }}</sub>
      </div>
      <div>
        <ClientOnly>
          <div v-html="sanitizeHtml(props.content)"></div>
        </ClientOnly>
        <slot />
      </div>
    </span>
  </div>
</template>
