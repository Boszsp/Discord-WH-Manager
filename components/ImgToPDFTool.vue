<script setup>
const pdfResult = ref(null);

const files = ref([]);
function getFileUrl(f) {
  return URL.createObjectURL(f);
}
</script>
<template>
  <v-sheet class="rounded-lg bg-component-background" :elevation="2" border rounded>
    <div class="p-4">
      <h6 class="text-h6">Images To PDF</h6>
      <div class="flex items-center mt-4 gap-2">
        <v-file-input accept="image/png, image/jpg" @click:clear="() => (files = [])" @update:modelValue="(nf) => (files = files.concat(nf))" chips :model-value="files" multiple label="File input" color="primary" density="compact" variant="outlined" hide-details></v-file-input>
        <v-btn
          variant="flat"
          @click="
            async () => {
              pdfResult = await generatePDFFromImage(files);
            }
          "
        >
          Genarate
        </v-btn>
      </div>
      <div class="flex items-center mt-4 gap-2">
        <p>File size : {{ formatFileSize(pdfResult?.size) }}</p>
      </div>
      <iframe v-if="pdfResult" width="100%" height="600rem" :src="getFileUrl(pdfResult)"></iframe>
    </div>
  </v-sheet>
</template>
