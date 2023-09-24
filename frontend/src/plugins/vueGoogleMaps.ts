import VueGoogleMaps from "@fawmi/vue-google-maps";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const options = {
    load: {
      key: config.public.mapsApiKey,
    },
  };
  nuxtApp.vueApp.use(VueGoogleMaps, options);
});
