// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  devtools: { 
    enabled: true ,
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    configPath: "tailwind.config",
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },

  runtimeConfig: {
    username:"",
    password:"",
    backendPassword: "xxxxxx-xxxx-xxxx-xxx-xxxx-xxxxxx",
    public: {
      bypassList: ["/","/form"],
      paramDataMode:false,
      apiBase:undefined,
      staticMode:false,
      alwayMakeImageToWebp:false
    },
  },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  routeRules: {
  },

  nitro:{
    experimental:{
      openAPI:true
    },
  },

  compatibilityDate: "2024-09-20",
});
