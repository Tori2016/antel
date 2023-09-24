import api from "@/lib/axios";

export default {
  uploadAvatar(formData: FormData, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post("/files/avatar", formData, axiosHeader);
  },
  deleteAvatar(file: string, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.delete(`/files/avatar/${file}`, axiosHeader);
  },
};
