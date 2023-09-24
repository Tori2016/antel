import Toast, { TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options = {
    toastDefaults: {
      [TYPE.SUCCESS]: {
        timeout: 5000,
        icon: "fa fa-check-circle",
      },
      [TYPE.ERROR]: {
        timeout: 5000,
        icon: "fa fa-times-circle",
      },
      [TYPE.INFO]: {
        timeout: 5000,
        icon: "fa fa-info-circle",
      },
      [TYPE.WARNING]: {
        timeout: 5000,
        icon: "fa fa-exclamation-triangle",
      },
    },
  };

  nuxtApp.vueApp.use(Toast, options);
});
