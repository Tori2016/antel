import api from "@/lib/axios";

export default {
  findAll(aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.get("/webhooks/notifications", axiosHeader);
  },
  readNotifications(notifId: string, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.get(`/webhooks/notifications/${notifId}`, axiosHeader);
  },
};
