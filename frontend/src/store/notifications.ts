import { INotication } from "@/interfaces";

export const useNotificationsStore = defineStore("notifications", () => {
  const notifications = ref<INotication[]>([]);

  return {
    notifications,

    setNotifications(newNotif: INotication[]) {
      notifications.value = newNotif;
    },
  };
});
