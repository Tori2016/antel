import api from "@/lib/axios";

export default {
  create(userId: string, data: any, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.post(`/templates/${userId}`, data, axiosHeader);
  },
  findAll(query: string, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.get(`/templates${query}`, axiosHeader);
  },
  remove(userId: string, templateId: string, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.delete(
      `/templates?userId=${userId}&templateId=${templateId}`,
      axiosHeader
    );
  },
};
