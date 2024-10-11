<script setup>
const file = ref(null);
const refImg = ref(null);
const imgUrl = ref("")
const width = ref(null);
const height = ref(null);
function getFileUrl(f) {
  if (!f) return null;
  const objURL = URL.createObjectURL(f);
  imgUrl.value = objURL
  setTimeout(() => URL.revokeObjectURL(objURL), 100);
  return objURL;
}

function getImageSize() {
  width.value = refImg?.value.width
  height.value = refImg?.value.height;

}
</script>

<template>
  <v-sheet class="rounded-lg bg-component-background" :elevation="2" border rounded>
    <div class="p-4">
      <h6 class="text-h6">Image Tools</h6>
      <div class="flex items-center mt-4 gap-2">
        <v-file-input show-size @click:clear="() => (file = null)" @update:modelValue="(nf) => (file = nf,getFileUrl(file))" chips :model-value="file" label="File input" color="primary" density="compact" variant="outlined" hide-details></v-file-input>
        <v-btn
          variant="flat"
          prepend-icon="mdi-clipboard-file"
          @click="
            async () => {
              const nfile = await getFileFromClipboard();
              if (nfile) file = nfile;
            }
          "
        >
          Clipboard
        </v-btn>
      </div>
      <div class="flex mt-4 border w-full rounded overflow-hidden">
        <span  class="w-6/12 overflow-hidden object-scale-down">
          <img id="embed" class="scale-90 relative" :height="height" :width="width" :src="imgUrl" />
            
        <img   class="fixed opacity-0 z-1" v-if="file?.name" @load="()=>getImageSize()" :height="height" :width="width" ref="refImg" :src="imgUrl" />

        </span>
        <span class="w-6/12 p-4">
          <v-text-field type="number" label="Width" color="success" density="compact" variant="outlined"  v-model="width"></v-text-field>
          <v-text-field type="number" label="Height" color="success" density="compact" variant="outlined" v-model="height"></v-text-field>

          <v-btn
            @click="()=>getImageSize()"
            color="primary"
            class="w-full"
          >
            Make Image
          </v-btn>
        </span>
      </div>
    </div>
  </v-sheet>
</template>
