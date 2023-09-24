import api from "@/lib/axios";

import type { IFormUser } from "@/interfaces";

interface InactivateDto {
  userId: string;
  status: boolean;
}

interface FileAvatar {
  avatar: string;
}

export default {
  getAll(aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.get("/users", axiosHeader);
  },
  create(data: IFormUser, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.post("/users", data, axiosHeader);
  },
  updateAvatar(data: FileAvatar, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.patch("/users/update/avatar", data, axiosHeader);
  },
  delete(userId: string, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.delete(`/users/${userId}`, axiosHeader);
  },
  inactivate(data: InactivateDto, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
    };
    return api.post("/users/inactivate-user", data, axiosHeader);
  },
};
