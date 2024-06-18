<script setup>
const route = useRoute();
const curPath = ref(route.path);
const isAuth = useAuth();
const isDrawerOpen = ref(false);

const navs = [
  {
    title: "Home",
    path: "/",
    icon: "mdi-home",
  },
  {
    title: "Hooks",
    path: "/hooks",
    icon: "mdi-hook",
  },
  {
    title: "Prefix",
    path: "/prefix",
    icon: "mdi-format-letter-starts-with",
  },
  {
    title: "Tool",
    path: "/tool",
    icon: "mdi-tools",
  },
  {
    title: "Setting",
    path: "/setting",
    icon: "mdi-cog",
  },
];
</script>

<script></script>
<template>
  <v-app-bar color="background" :elevation="2" density="compact">
    <template v-slot:prepend>
      <div class="block xl:hidden">
        <v-app-bar-nav-icon @click.stop="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
      </div>
    </template>
    <v-app-bar-title>
      <div class="flex gap-2 items-center">
        <NuxtLink to="/" class="font-bold">
          <v-icon>mdi-message-text</v-icon>
          DWH Manager
        </NuxtLink>
        <v-divider class="ml-4" vertical></v-divider>
        <div class="hidden lg:flex gap-2">
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
            :prepend-icon="i.icon"
          >
            {{ i.title }}
          </v-btn>
        </div>
      </div>
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn
        @click="
          () => {
            navigateTo('https://github.com/Boszsp/Discord-WH-Manager/discussions/', {external: true});
          }
        "
        icon="mdi-forum"
      ></v-btn>
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
  <div class="lg:hidden">
    <v-navigation-drawer rail v-model="isDrawerOpen" temporary>
      <v-list-item
        v-for="nav in navs"
        :active="curPath == nav.path"
        @click="
          () => {
            navigateTo(nav.path).then(() => {
              curPath = nav.path;
            });
          }
        "
        density="comfortable"
        link
        :prepend-icon="nav.icon"
        class="mt-4"
      >
        <v-tooltip activator="parent" location="end">{{ nav.title }}</v-tooltip>
      </v-list-item>
    </v-navigation-drawer>
  </div>
  <v-main class="w-full">
    <slot />
  </v-main>
</template>
