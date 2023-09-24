import { storeToRefs } from "pinia";
import Swal from "sweetalert2";

import notifApi from "@/api/notifApi";
import { useNotificationsStore } from "@/store/notifications";
import { INotication } from "@/interfaces";

const notification = ref(false);

const useNotifications = () => {
  const store = useNotificationsStore();
  const { notifications } = storeToRefs(store);
  const { accessToken } = useAuth();

  const getNotifications = async (): Promise<INotication[]> => {
    const { data } = await notifApi.findAll(accessToken.value);
    store.setNotifications(data);
    return data;
  };

  const notificationReaded = async (notif: INotication) => {
    try {
      const { data } = await notifApi.readNotifications(
        notif._id,
        accessToken.value
      );
      if (data.message === "NOTIFICATION_UPDATED") {
        return getNotifications();
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "NOTIFICATION_NOT_UPDATED") {
        Swal.fire({
          title: "¡Error!",
          text: "La notificación no pudo ser leída.",
          icon: "error",
          confirmButtonColor: "#7366FF",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  };

  const notificationOpen = () => {
    notification.value = !notification.value;
  };

  return {
    getNotifications,
    notification,
    notificationOpen,
    notificationReaded,
    notifications,
  };
};

export default useNotifications;
