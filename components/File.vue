<script setup>
const img = useImage();
const props = defineProps({
  data: Object,
});
const Src = ref("xxx");
function isImageFile(file) {
  if (!file || typeof file !== "object" || !file.type) {
    return false;
  }

  return file.type.startsWith("image/");
}
function fileToDataURL(file) {
  const reader = new FileReader();
  reader.onload = () => {
    Src.value = reader.result;
  };
  reader.readAsDataURL(file);
}

if (isImageFile(props.data)) {
  fileToDataURL(props.data);
} else {
  Src.value = URL.createObjectURL(props.data);
}
</script>
<template>
  <v-sheet v-if="!isImageFile(props.data)" border rounded="lg" class="bg-background-secondary">
    <div class="p-4 w-[30rem] flex items-center gap-2">
      <span>
        <v-icon size="36" class="opacity-50" icon="mdi-file-document-multiple"></v-icon>
      </span>
      <span>
        <a class="text-sm" target="_blank" :href="Src">{{ props.data?.name }}</a>
        <br />
        <sup class="opacity-50">{{ formatFileSize(props.data?.size) }}</sup>
      </span>
    </div>
  </v-sheet>
  <NuxtImg v-else class="rounded w-8/12" :src="Src" />
</template>
