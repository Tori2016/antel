export default defineNuxtRouteMiddleware(async () => {
  const { userRole } = useAuth();
  if (userRole.value === "admin") return;
  return navigateTo("/");
});
