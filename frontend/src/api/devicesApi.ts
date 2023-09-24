import api from "@/lib/axios";

interface DeleteData {
  userId: string;
  dId: string;
  templateId: string;
}

export default {
  create(userId: string, data: any, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.post(`/devices/${userId}`, data, axiosHeader);
  },
  findAll(query: string, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.get(`/devices${query}`, axiosHeader);
  },
  remove(query: DeleteData, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
      params: query,
    };
    return api.delete("/devices", axiosHeader);
  },
  updateSaveruleStatus(data: any, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.put("/devices/save-rule", data, axiosHeader);
  },
  selectedDevice(dId: string, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.get(`/devices/select-device/${dId}`, axiosHeader);
  },
};
