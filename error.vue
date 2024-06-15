<script setup>
const error = useError();
</script>

<template>
  <v-theme-provider class="h-full" theme="dark" with-background>
    <v-app>
      <NuxtLayout name="blank">
        <div class="flex flex-col h-screen w-screen justify-center items-center">
          <h1 class="text-h1 !font-bold w-fit">{{ error.statusCode }}</h1>
          <h6 class="text-h4 w-fit mt-4 mb-8">{{ error.message }}</h6>
          <v-btn @click="() => navigateTo('/')">Back</v-btn>
        </div>
      </NuxtLayout>
    </v-app>
  </v-theme-provider>
</template>
