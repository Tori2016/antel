<script setup lang="ts">
import type { IToSendMqtt, IWidgetConfig } from "@/interfaces";

const props = defineProps<{ config: IWidgetConfig }>();

const { $emit, $listenOff, $listenOn } = useNuxtApp();

const indicatorData = ref<boolean>(false);
const topic = ref<string>("");

const sendValue = () => {
  indicatorData.value = !indicatorData.value;

  const toSend: IToSendMqtt = {
    topic: `${props.config.userId}/${props.config.selectedDevice.dId}/${props.config.variable}/actdata`,
    msg: {
      value: indicatorData.value,
    },
  };
  $emit("mqtt-sender", toSend);
};

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
          <span class="f-14">
            {{ config.selectedDevice.name }} -
            <b>{{ config.variableFullName }}</b>
          </span>
          <div class="mt-2">
            <div class="media-body text-end">
              <label class="switch m-0">
                <input
                  v-model="indicatorData"
                  @click.prevent="sendValue()"
                  type="checkbox"
                />
                <span :class="getIconColorClass()" class="switch-state"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-start gap-2">
        <span style="font-size: 13px" class="fw-normal f-light m-0 p-0">
          <Icon style="font-size: 10px" name="fa6-solid:power-off" />
          Interruptor ON - OFF
        </span>
      </div>
    </div>
  </div>
</template>
