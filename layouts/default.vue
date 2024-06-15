<script setup>
const route = useRoute();
const curPath = ref(route.path);
const isAuth = useAuth();
const isLoading = ref(false);

const navs = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Hooks",
    path: "/hooks",
  },
  {
    title: "Prefix",
    path: "/prefix",
  },
  {
    title: "Tool",
    path: "/tool",
  },
];
</script>

<script></script>
<template>
  <v-app-bar color="background" :elevation="2" density="compact">
    <template v-slot:prepend>
      <div class="block xl:hidden">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </div>
    </template>
    <v-app-bar-title>
      <div class="flex gap-2 items-center">
        <h3>App</h3>
        <v-divider class="ml-4" vertical></v-divider>
        <v-btn
          v-for="i in navs"
          :variant="curPath == i.path ? 'tonal' : 'text'"
          :key="i.title"
          @click="
            () => {
              navigateTo(i.path).then(() => {
                curPath = i.path;
              });
            }
          "
          size="small"
        >
          {{ i.title }}
        </v-btn>
      </div>
    </v-app-bar-title>
    <template v-slot:append>
      <v-no-ssr>
        <v-btn
          v-if="!isAuth"
          @click="
            () => {
              navigateTo('/login').then(() => {
                curPath = i.path;
              });
            }
          "
          icon="mdi-login"
        ></v-btn>
        <v-btn
          v-else
          @click="
            async () => {
              await logout();
              await navigateTo('/', {redirectCode: 302});
              refresh();
            }
          "
          icon="mdi-logout"
        ></v-btn>
      </v-no-ssr>
    </template>
  </v-app-bar>
  <v-main>
    <slot />
  </v-main>
</template>
