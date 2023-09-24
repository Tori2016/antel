<script setup lang="ts">
import type { IWidgetConfig } from "@/interfaces";

const props = defineProps<{ config: IWidgetConfig }>();

const { $listenOn, $listenOff } = useNuxtApp();

const indicatorNumData = ref<number>(0);
const time = ref(Date.now());
const nowTime = ref(Date.now());
const topic = ref<string>("");

// Methods
const processReceivedData = (data: any) => {
  try {
    time.value = Date.now();
    indicatorNumData.value = data.value;
  } catch (error) {
    console.log(error);
  }
};

const getIconColorClass = () => {
  if (props.config.class == "primary") {
    return "widget-primary";
  }
  if (props.config.class == "secondary") {
    return "widget-secondary";
  }
  if (props.config.class == "success") {
    return "widget-success";
  }
  if (props.config.class == "warning") {
    return "widget-warning";
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
  $listenOff(`${topic.value}/sdata`);
});

watch(
  props,
  () => {
    setTimeout(() => {
      indicatorNumData.value = 0;
      $listenOff(`${topic.value}/sdata`);

      topic.value = `${props.config.userId}/${props.config.selectedDevice.dId}/${props.config.variable}`;
      $listenOn(`${topic.value}/sdata`, (data) => processReceivedData(data));
    }, 300);
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="card widget-card">
    <div class="card-body p-4">
      <div class="d-flex align-items-center justify-content-between">
        <div class="icon-card">
          <Icon :class="getIconColorClass()" class="f-24" :name="config.icon" />
        </div>
        <div class="text-end">
          <span class="f-14">
            {{ config.selectedDevice.name }} -
            <b>{{ config.variableFullName }}</b>
          </span>
          <h4 class="fw-normal m-0 p-0">
            {{ indicatorNumData.toFixed(config.decimalPlaces) }}
            {{ config.unit }}
          </h4>
        </div>
      </div>
      <div class="d-flex justify-content-between gap-2">
        <span style="font-size: 13px" class="fw-normal f-light m-0 p-0">
          <Icon style="font-size: 10px" name="fa6-solid:eye" />
          Indicador Numérico
        </span>
        <span style="font-size: 13px" class="fw-normal f-light m-0 p-0">
          <Icon style="font-size: 10px" name="fa6-regular:clock" />
          {{ getTimeAgo((nowTime - time) / 1000) }} ago
        </span>
      </div>
    </div>
  </div>
</template>
