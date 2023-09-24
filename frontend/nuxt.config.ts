export default defineNuxtConfig({
  ssr: false,
  srcDir: "src",

  spaLoadingTemplate: false,

  runtimeConfig: {
    public: {
      apiUri: process.env.API_URI,
      mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      getAvatarUri: `${process.env.API_URI}/files/avatar/`,
      mqttPort: process.env.MQTT_PORT,
      mqttHost: process.env.MQTT_HOST,
      connectTimeout: process.env.MQTT_CONNECT_TIMEOUT,
      reconnectPeriod: process.env.MQTT_RECONNECT_PERIOD,
      mqttProtocol: process.env.MQTT_PROTOCOL,
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "es",
      },
      meta: [{ "http-equiv": "X-UA-Compatible", content: "IE=edge" }],
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Antel",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  css: [
    "bootstrap/scss/bootstrap.scss",
    "@/assets/scss/app.scss",
    "@/assets/css/main.css",
  ],

  modules: [
    "nuxt-icon",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Rubik: {
            wght: [400, 500, 700],
            ital: [400, 500, 700],
          },
          Roboto: {
            wght: [300, 400, 500, 700],
            ital: [300, 400, 500, 700],
          },
          download: true,
          inject: true,
        },
      },
    ],
  ],

  appConfig: {
    nuxtIcon: {
      size: "1.5em",
    },
  },
});
