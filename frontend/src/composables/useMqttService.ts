import * as mqtt from "mqtt/dist/mqtt.min";
import { color } from "console-log-colors";
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";

import sound from "~/assets/media/alerta2.mp3";

import authruleApi from "@/api/authruleApi";
import { useAuthStore } from "@/store/auth";

const toast = useToast();
const config = useRuntimeConfig();
const player = ref(new Audio(sound));

const soundAlert = () => {
  player.value.play();
};

const retryTimes = ref(0);

const client = ref<any>({
  connected: false,
});

const useMqttService = () => {
  const store = useAuthStore();
  const { loggedUser, userRole, accessToken } = storeToRefs(store);

  const { $listenOn, $emit } = useNuxtApp();
  const { getNotifications } = useNotifications();

  const conection = ref({
    protocol: config.public.mqttProtocol,
    host: config.public.mqttHost,
    port: config.public.mqttPort,
    endpoint: "/mqtt",
    clean: true,
    keepalive: 120,
    connectTimeout: parseInt(config.public.connectTimeout),
    reconnectPeriod: parseInt(config.public.reconnectPeriod),
    clientId: `web_${loggedUser.value._id}_${Math.random()
      .toString(16)
      .substring(2, 8)}`,
    username: "",
    password: "",
  });

  const initData = () => {
    client.value = {
      connected: false,
    };
    retryTimes.value = 0;
  };

  const handleOnReConnect = async () => {
    console.log(color.red("Reconnecting... ❌"));
    await getMqttCredentialsReconnect();
    retryTimes.value += 1;
    if (retryTimes.value > 5) {
      try {
        client.value.end();
        initData();
      } catch (error) {
        console.log(color.red("handleOnReConnect catch Error ❌"), error);
      }
    }
  };

  const startMqttClient = async () => {
    await getMqttCredentials();

    const deviceSubscribeTopic = `${loggedUser.value._id}/+/+/sdata`;
    const notifSubscribeTopic = `${loggedUser.value._id}/+/+/notif`;
    const statusSubscribeTopic = `${loggedUser.value._id}/+/+/status`;
    const dataSubscribeTopic = `${loggedUser.value._id}/+/+/data`;

    const { protocol, host, port, endpoint, ...options } = conection.value;
    const connectUrl = `${protocol}://${host}:${port}${endpoint}`;

    try {
      client.value = mqtt.connect(connectUrl, options);

      if (client.value.on) {
        client.value.on("connect", () => {
          console.log(color.green("Conexión MQTT Exitosa! ✅"));

          if (userRole.value === "user") {
            client.value.subscribe(
              deviceSubscribeTopic,
              { qos: 0 },
              (error: any) => {
                if (error) {
                  console.log(color.red("Error: deviceSubscribeTopic ❌"));
                  return;
                }
                console.log(color.green("deviceSubscribeTopic ✅"));
              }
            );
            client.value.subscribe(
              notifSubscribeTopic,
              { qos: 0 },
              (error: any) => {
                if (error) {
                  console.log(color.red("Error: notifSubscribeTopic ❌"));
                  return;
                }
                console.log(color.green("notifSubscribeTopic ✅"));
              }
            );
            client.value.subscribe(
              statusSubscribeTopic,
              { qos: 0 },
              (error: any) => {
                if (error) {
                  console.log(color.red("Error: statusSubscribeTopic ❌"));
                  return;
                }
                console.log(color.green("statusSubscribeTopic ✅"));
              }
            );
            client.value.subscribe(
              dataSubscribeTopic,
              { qos: 0 },
              (error: any) => {
                if (error) {
                  console.log(color.red("Error: dataSubscribeTopic ❌"));
                  return;
                }
                console.log(color.green("dataSubscribeTopic ✅"));
              }
            );
          }
        });

        client.value.on("error", (error: any) => {
          console.log(color.red("Connection failed ❌"), error);
        });

        client.value.on("close", () => {
          console.log(color.red("Se cerro la conexión ❌"));
          window.location.reload();
        });

        client.value.on("reconnect", handleOnReConnect);

        client.value.on("message", (topic: string, message: Object) => {
          try {
            const splittedTopic = topic.split("/");
            const msgType = splittedTopic[3];

            if (msgType === "notif") {
              toast.error(message.toString(), { timeout: 10000 });
              soundAlert();
              getNotifications();
              return;
            } else if (msgType === "sdata") {
              $emit(topic, JSON.parse(message.toString()));
              return;
            } else if (msgType === "status") {
              console.log(
                "Mensaje de WillTopic STATUS",
                JSON.parse(message.toString())
              );
              return;
            } else if (msgType === "data") {
              $emit(topic, JSON.parse(message.toString()));
              return;
            }
          } catch (error) {
            console.log(error);
          }
        });

        $listenOn("mqtt-sender", (toSend: any) => {
          client.value.publish(
            toSend.topic,
            JSON.stringify(toSend.msg),
            { qos: 0 },
            (error: any) => {
              if (error) {
                console.log(color.red("Error: Publish ❌"), error);
                return;
              }
            }
          );
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMqttCredentials = async () => {
    try {
      const { data } = await authruleApi.getWebCredentials(accessToken.value);
      if (data) {
        conection.value.username = data.username;
        conection.value.password = data.password;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMqttCredentialsReconnect = async () => {
    try {
      const { data } = await authruleApi.getWebCredentialsReconnect(
        accessToken.value
      );
      if (data) {
        client.value.options.username = data.username;
        client.value.options.password = data.password;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { startMqttClient, soundAlert };
};

export default useMqttService;
