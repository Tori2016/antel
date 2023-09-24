<script setup lang="ts">
import type { IWidgetConfig } from "@/interfaces";

interface IToSendMqtt {
  topic: string;
  msg: {
    value?: string;
  };
}

const props = defineProps<{ config: IWidgetConfig }>();
const { $emit } = useNuxtApp();
const sending = ref<boolean>(false);

const sendValue = () => {
  sending.value = true;

  setTimeout(() => {
    sending.value = false;
  }, 500);

  const toSend: IToSendMqtt = {
    topic: `${props.config.userId}/${props.config.selectedDevice.dId}/${props.config.variable}/actdata`,
    msg: {
      value: props.config.message,
    },
  };

  $emit("mqtt-sender", toSend);
};

const getIconColorClass = () => {
  if (!sending.value) {
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
            <button
              :class="`btn btn-${config.class} widget-btn`"
              type="button"
              @click="sendValue"
            >
              {{ config.text }}
            </button>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-start gap-2">
        <span style="font-size: 13px" class="fw-normal f-light m-0 p-0">
          <Icon style="font-size: 10px" name="fa6-solid:power-off" />
          Botón Pulsador
        </span>
      </div>
    </div>
  </div>
</template>
