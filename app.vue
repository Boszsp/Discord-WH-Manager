<script setup>
import {Toaster} from "vue-sonner";
useSeoMeta({
  title: "Discord WH Manager",
});
</script>
<template>
  <NuxtLoadingIndicator color="#5864f2" />
  <v-app>
    <v-theme-provider class="h-full" theme="dark" with-background>
      <Toaster position="top-right" richColors theme="dark" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-theme-provider>
  </v-app>
</template>
