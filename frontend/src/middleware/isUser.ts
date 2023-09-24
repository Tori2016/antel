export default defineNuxtRouteMiddleware(async () => {
  const { userRole } = useAuth();
  if (userRole.value === "user") return;
  return navigateTo("/");
});
