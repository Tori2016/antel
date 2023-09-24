import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";

export default defineNuxtRouteMiddleware(async () => {
  const store = useAuthStore();
  const { accessToken } = storeToRefs(store);
  if (accessToken.value || sessionStorage.getItem("auth")) {
    return navigateTo("/");
  } else {
    store.logout();
  }
});
