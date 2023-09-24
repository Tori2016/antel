import api from "@/lib/axios";
import { AuthLogin } from "@/interfaces";

export default {
  verifyAccount(token: string) {
    return api.get(`/auth/verify-account/${token}`);
  },
  login(data: AuthLogin) {
    return api.post("/auth/login", data);
  },
  logout() {
    return api.get("/auth/logout");
  },
  refreshToken() {
    return api.get("/auth/refresh");
  },
  forgotPassword(data: any) {
    return api.post("/auth/forgot-password", data);
  },
  verifyToken(token: string) {
    return api.get(`/auth/forgot-password/${token}`);
  },
  updatePasswordToken(token: string, data: any) {
    return api.post(`/auth/forgot-password/${token}`, data);
  },
  updatePassword(data: any, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.patch("/auth/update-password", data, axiosHeader);
  },
};
