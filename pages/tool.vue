<script setup>
const config = useRuntimeConfig();

if (config.public.staticMode) {
  navigateTo("/");
}
</script>
<template>
  <div class="m-6 flex flex-col gap-4">
    <ClientOnly>
      <FileTools1 />
    </ClientOnly>

    <!-- <ClientOnly>
      <ImageTool />
    </ClientOnly>-->

    <FetchTool />
  </div>
</template>
