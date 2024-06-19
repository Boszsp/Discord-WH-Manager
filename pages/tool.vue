<script setup>
const config = useRuntimeConfig();
if (config.public.staticMode) {
  navigateTo("/");
}
</script>
<template>
  <div class="m-6">
    <FetchTool />
  </div>
</template>
