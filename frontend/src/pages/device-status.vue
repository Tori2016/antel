<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDevicesStore } from "@/store/devices";

useHead({
  titleTemplate: (title) => `Estado del dispositivo seleccionado | ${title}`,
});
definePageMeta({
  middleware: ["auth", "is-user"],
});

const { $listenOn, $listenOff } = useNuxtApp();
const topic = ref<string>("");

const store = useDevicesStore();
const { selectedDevice, deviceData } = storeToRefs(store);
const time = ref(Date.now());
const nowTime = ref(Date.now());

const processReceivedData = (data: any) => {
  try {
    time.value = Date.now();
    store.setDeviceData(data);
  } catch (error) {
    console.log(error);
  }
};

const getNow = () => {
  nowTime.value = Date.now();
  setTimeout(() => {
    getNow();
  }, 1000);
};

const getTimeAgo = (seconds: number) => {
  if (seconds < 0) {
    seconds = 0;
  }

  if (seconds < 59) {
    return seconds.toFixed() + " s";
  }

  if (seconds > 59 && seconds <= 3600) {
    seconds = seconds / 60;
    return seconds.toFixed() + " min";
  }

  if (seconds > 3600 && seconds <= 86400) {
    seconds = seconds / 3600;
    return seconds.toFixed() + " h";
  }

  if (seconds > 86400) {
    seconds = seconds / 86400;
    return seconds.toFixed() + " d";
  }
};

onMounted(() => {
  getNow();
});

onBeforeUnmount(() => {
  $listenOff(`${topic.value}/data`);
});

watch(
  selectedDevice,
  () => {
    setTimeout(() => {
      store.setDeviceData({
        deviceSerial: "",
        deviceManufacturer: "",
        deviceFwVersion: "",
        deviceHwVersion: "",
        deviceSdk: "",
        data: {
          deviceRamAvailable: 0,
          deviceRamSizeKb: 0,
          deviceCpuTemp: 0,
          deviceActiveTime: "",
          deviceSpiffsUsed: "",
          deviceCpuClock: "",
          deviceFlashSize: "",
          deviceRestartS: "",
          mqttStatus: false,
          mqttServer: "",
          wifiStatus: false,
          wifiRssiStatus: 0,
          wifiQuality: 0,
        },
      });
      $listenOff(`${topic.value}/data`);

      topic.value = `${selectedDevice.value.userId}/${selectedDevice.value.dId}/device`;
      $listenOn(`${topic.value}/data`, (data) => processReceivedData(data));
    }, 300);
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <BreadCrumbs title="Estado del dispositivo" />
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12 col-xl-6 box-col-6">
        <span style="font-size: 13px" class="fw-normal f-light m-0 p-0">
          <Icon style="font-size: 10px" name="fa6-regular:clock" />
          {{ getTimeAgo((nowTime - time) / 1000) }} ago
        </span>
      </div>
    </div>
  </div>
  <Json :value="deviceData" />
</template>
