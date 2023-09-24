<script setup lang="ts">
import type { IWidgetConfig } from "@/interfaces";

const props = defineProps<{ config: IWidgetConfig }>();

const { $listenOn, $listenOff } = useNuxtApp();

const indicatorData = ref<boolean>(false);
const topic = ref<string>("");

const processReceivedData = (data: any) => {
  try {
    indicatorData.value = data.value;
  } catch (error) {
    console.log(error);
  }
};

const getIconColorClass = () => {
  if (!indicatorData.value) {
    return "widget-dark";
  }
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

onBeforeUnmount(() => {
  $listenOff(`${topic.value}/sdata`);
});

watch(
  props,
  () => {
    setTimeout(() => {
      indicatorData.value = false;
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
          <span class="f-14">{{ config.selectedDevice.name }}</span>
          <h5 class="mb-1">{{ config.variableFullName }}</h5>
        </div>
      </div>
      <div class="d-flex justify-content-start gap-2">
        <span style="font-size: 13px" class="fw-normal f-light m-0 p-0">
          <Icon style="font-size: 10px" name="mdi:lightbulb-on" />
          Indicador Luminoso
        </span>
      </div>
    </div>
  </div>
</template>
