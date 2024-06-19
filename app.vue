<script setup>
import {Toaster} from "vue-sonner";
useSeoMeta({
  title: "Discord WH Manager",
  ogTitle: "Discord WH Manager",
  ogImage: "/cover.png",
});
</script>
<template>
  <NuxtLoadingIndicator color="#5864f2" />
  <v-theme-provider class="h-full" theme="dark" with-background>
    <v-app>
      <Toaster closeButton position="top-right" richColors theme="dark" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-app>
  </v-theme-provider>
</template>
<style>
html,
body {
  height: 100%;
  width: 100%;
}
html {
  background-color: var(--v-theme-background);
  overflow: hidden;
}
body {
  overflow-y: auto;
}
</style>
