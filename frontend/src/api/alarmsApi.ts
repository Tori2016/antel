import api from "@/lib/axios";

export default {
  create(data: any, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.post("/alarms", data, axiosHeader);
  },
  deleteAlarmRule(emqxRuleId: any, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.delete(`/alarms/${emqxRuleId}`, axiosHeader);
  },
  updateAlarmRule(emqxRuleId: any, data: any, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.put(`/alarms/${emqxRuleId}`, data, axiosHeader);
  },
};
