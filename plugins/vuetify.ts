// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { md3, md2 } from "vuetify/blueprints";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    blueprint: md2,
    ssr: true,
    theme: {
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: "#5864f2",
            secondary: "#22a559",
            background: "#313338",
            "background-secondary": "#2b2d31",
            "component-background": "#383a40",
            "background-tertiary":"#1e1f22",
            success: "#248046",
            warning: "#f0b033",
            danger: "#da363c",
            info: "#05a8fc",
          },
        },
        od: {
          dark: true,
          colors: {
            primary: "#ff7f00",
            secondary: "#22a559",
            background: "#000",
            "background-secondary": "#2b2d31",
            "component-background": "#383a40",
            success: "#248046",
            warning: "#f0b033",
            danger: "#da363c",
            info: "#05a8fc",
          },
        },
        light: {
          dark: false,
          colors: {
            primary: "#5864f2",
            secondary: "#22a559",
            background: "#ffffff",
            "background-secondary": "#f2f3f5",
            "component-background": "#f9f9f9",
            "background-tertiary":"#e3e5e8",
            success: "#248046",
            warning: "#f0b033",
            danger: "#da363c",
            info: "#05a8fc",
          },
        },
      },
    },
  });
  app.vueApp.use(vuetify);
});
