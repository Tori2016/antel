import { AuthLogin, ILoggedUser } from "@/interfaces";
import authApi from "@/api/authApi";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref("");
  const userRole = ref("");
  const expiresIn = ref(0);
  const loggedUser = ref<ILoggedUser>({
    _id: "",
    firstName: "",
    lastName: "",
    avatar: "",
    email: "",
    phone: "",
    role: "",
    token: "",
    isVerified: false,
    isActive: false,
    createdAt: 0,
    deleted: false,
  });

  const login = async (user: AuthLogin) => {
    try {
      const { data } = await authApi.login(user);
      loggedUser.value = data.user;
      userRole.value = data.user.role;
      accessToken.value = data.access_token;
      expiresIn.value = data.expires_in;
      sessionStorage.setItem("auth", "Antel Ingeniería");
      setTime(expiresIn.value);
      return data;
    } catch (error: any) {
      throw error.response.data.message;
    }
  };

  const refreshToken = async () => {
    try {
      const { data } = await authApi.refreshToken();
      if (!data.user.isActive) logout();
      loggedUser.value = data.user;
      userRole.value = data.user.role;
      accessToken.value = data.access_token;
      expiresIn.value = data.expires_in;
      sessionStorage.setItem("auth", "Antel Ingeniería");
      setTime(expiresIn.value);
    } catch (error: any) {
      sessionStorage.removeItem("auth");
      throw error.response.data.message;
    }
  };

  const logout = async () => {
    try {
      return await authApi.logout();
    } catch (error: any) {
      throw error.response.data.message;
    } finally {
      resetLogout();
    }
  };

  const resetLogout = () => {
    accessToken.value = "";
    expiresIn.value = 0;
    sessionStorage.removeItem("auth");
  };

  const setTime = (expiresIn: number) => {
    setTimeout(() => {
      refreshToken();
    }, expiresIn * 1000 - 15000);
  };

  return {
    // State
    accessToken,
    loggedUser,
    userRole,

    // Actions
    login,
    logout,
    refreshToken,
  };
});
