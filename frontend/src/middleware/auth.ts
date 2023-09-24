export default defineNuxtRouteMiddleware(async () => {
  const { accessToken, logout, refreshToken } = useAuth();

  if (accessToken.value) return;

  if (sessionStorage.getItem("auth")) {
    try {
      await refreshToken();
    } catch (error) {
      return navigateTo("/login");
    }
  } else {
    logout();
    return navigateTo("/login");
  }
});
