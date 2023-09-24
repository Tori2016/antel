import type { IUser } from "@/interfaces";

export const useUsersStore = defineStore("users", () => {
  const users = ref<IUser[]>([]);

  return {
    // State
    users,

    // Actions
    setUsers(newUsers: IUser[]) {
      users.value = newUsers;
    },
  };
});
