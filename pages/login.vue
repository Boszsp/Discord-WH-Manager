<script setup>
definePageMeta({
  layout: "blank",
});
const username = ref("");
const password = ref("");
</script>
<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <v-card elevation="4" class="bg-background w-[48rem] flex">
      <div class="flex">
        <span class="lg:w-2/3 w-full">
          <v-card-item>
            <v-card-title>
              <p class="font-bold text-4 text-center mt-6">เข้าสู่ระบบ</p>
            </v-card-title>
            <v-card-subtitle>
              <p class="text-center">ยินดีต้อนรับเข้าสู่ระบบ</p>
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div class="flex flex-col items-center mt-4 gap-6">
              <v-text-field
                hide-details
                density="compact"
                color="primary"
                class="bg-background-tertiary w-[28rem]"
                label="Username*"
                v-model="username"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                hide-details
                density="compact"
                color="primary"
                class="bg-background-tertiary w-[28rem]"
                label="Password*"
                v-model="password"
                variant="outlined"
              ></v-text-field>
            </div>
          </v-card-text>
          <v-card-actions>
            <div class="flex flex-col items-center mt-4 gap-6 w-full mb-12">
              <v-btn
                variant="elevated"
                color="primary"
                class="w-[28rem]"
                @click="
                  async () => {
                    const res = await login(username, password);
                    if (res) navigateTo('/', { redirectCode: 302 });
                  }
                "
                >Login</v-btn
              >
            </div>
          </v-card-actions>
        </span>
        <span class="lg:w-1/3 hidden lg:flex items-center justify-center">
          <v-icon
            class="text-secondary"
            icon="mdi-door-closed"
            size="200"
          ></v-icon>
        </span>
      </div>
    </v-card>
  </div>
</template>
