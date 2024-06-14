<script setup>
import { Toaster } from "vue-sonner";
</script>
<template>
  <NuxtLoadingIndicator color="#5864f2" />
  <v-app>
    <Toaster position="top-right" richColors theme="dark" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
