<script setup>
const img = useImage();

definePageMeta({
  layout: "blank",
});
const username = ref("");
const password = ref("");
const isLoading = ref(false);
const isVisiblePassword = ref(false);

const randomedBg = Math.floor(Math.random() * 2) == 1 ? "/cover.jpeg" : "/bg-1.png";
</script>
<template>
  <v-card-title class="fixed top-12 left-4 lg:left-12 opacity-90 z-50">
    <div>
      <NuxtLink to="/" class="font-bold flex items-center">
        <NuxtImg src="/logo.png" sizes="48" format="webp" />
        DWH Manager
      </NuxtLink>
    </div>
  </v-card-title>
  <div class="fixed z-0 top-0 w-screen h-screen flex items-center justify-center bg-cover" :style="{backgroundImage: 'url(' + img(randomedBg, {format: 'webp', blur: 4}) + ')'}">
    <v-card elevation="4" class="bg-background w-[48rem] h-[26rem] m-2 lg:m-0">
      <div class="flex h-full items-center max-lg:justify-center">
        <span class="lg:w-3/5 h-fit p-8 w-[28rem]">
          <v-card-item>
            <v-card-title>
              <p class="font-bold text-2xl text-center mt-6 mb-2">เข้าสู่ระบบ</p>
            </v-card-title>
            <v-card-subtitle>
              <p class="text-center">ยินดีต้อนรับเข้าสู่ระบบ</p>
            </v-card-subtitle>
          </v-card-item>

          <div class="flex flex-col items-center mt-4 gap-6 w-full mb-12">
            <v-text-field hide-details density="compact" color="primary" class="bg-background-tertiary w-full" label="Username*" v-model="username" variant="outlined"></v-text-field>
            <v-text-field :append-inner-icon="isVisiblePassword ? 'mdi-eye-off' : 'mdi-eye'" :type="isVisiblePassword ? 'text' : 'password'" @click:append-inner="isVisiblePassword = !isVisiblePassword" hide-details density="compact" color="primary" class="bg-background-tertiary w-full" label="Password*" v-model="password" variant="outlined"></v-text-field>
          </div>
          <div class="flex flex-col items-center mt-4 gap-6 w-full mb-12">
            <v-btn
              variant="elevated"
              color="primary"
              class="w-full"
              :loading="isLoading"
              @click="
                async () => {
                  isLoading = true;
                  const res = await login(username, password);
                  if (res) navigateTo('/', {redirectCode: 302});
                  isLoading = false;
                }
              "
            >
              เข้าสู่ระบบ
            </v-btn>
          </div>
        </span>
        <span class="lg:w-2/5 hidden lg:flex flex-col gap-4 items-center justify-center p-2 pr-8">
          <NuxtImg format="webp" class="rounded w-[12rem]" src="/door.png" />
        </span>
      </div>
    </v-card>
  </div>
</template>
