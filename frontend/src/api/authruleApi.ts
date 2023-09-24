import api from "@/lib/axios";

interface DeviceCredential {
  dId: string;
  password: string;
}

export default {
  getWebCredentials(aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.get("/authrules/web-credentials", axiosHeader);
  },

  getWebCredentialsReconnect(aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.get("/authrules/web-credentials-reconnect", axiosHeader);
  },

  getDeviceCredentials(data: DeviceCredential, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.post("/authrules/device-credentials", data, axiosHeader);
  },
};
