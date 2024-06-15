<script setup>
const img = useImage();

definePageMeta({
  layout: "blank",
});
const username = ref("");
const password = ref("");
</script>
<template>
  <div class="w-screen h-screen flex items-center justify-center" :style="{backgroundImage: 'url(' + img('/bg-1.png', {format: 'webp', blur: 4}) + ')'}">
    <v-card elevation="4" class="bg-background w-[48rem] h-[26rem]">
      <div class="flex h-full items-center">
        <span class="lg:w-3/5 w-full h-fit p-8">
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
            <v-text-field hide-details density="compact" color="primary" class="bg-background-tertiary w-full" label="Password*" v-model="password" variant="outlined"></v-text-field>
          </div>
          <div class="flex flex-col items-center mt-4 gap-6 w-full mb-12">
            <v-btn
              variant="elevated"
              color="primary"
              class="w-[28rem]"
              @click="
                async () => {
                  const res = await login(username, password);
                  if (res) navigateTo('/', {redirectCode: 302});
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
