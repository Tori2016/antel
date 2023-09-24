<script setup lang="ts">
import type { IWidgetConfig } from "@/interfaces";

const props = defineProps<{ config: IWidgetConfig }>();

const { $listenOn, $listenOff } = useNuxtApp();

const mapData = ref({ lat: 0.0, lng: 0.0 });
const time = ref(Date.now());
const nowTime = ref(Date.now());
const topic = ref<string>("");

const processReceivedData = (data: any) => {
  try {
    time.value = Date.now();
    mapData.value = data;
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
  $listenOff(`${topic.value}/sdata`);
});

watch(
  props,
  () => {
    setTimeout(() => {
      $listenOff(`${topic.value}/sdata`);

      if (props.config.demo) {
        mapData.value.lat = 2.957119;
        mapData.value.lng = -75.306654;
        return;
      }

      mapData.value.lat = 0.0;
      mapData.value.lng = 0.0;

      topic.value = `${props.config.userId}/${props.config.selectedDevice.dId}/${props.config.variable}`;
      $listenOn(`${topic.value}/sdata`, (data) => processReceivedData(data));
    }, 300);
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="card widget-card-h">
    <div class="chart-widget-top">
      <div class="row card-body pb-0 m-0">
        <div class="d-flex justify-content-between mb-3">
          <h6 class="m-0">
            <Icon :name="config.icon" />
            {{ config.variableFullName }}
          </h6>
          <div>
            <span style="font-size: 13px" class="fw-normal m-0 p-0">
              <Icon style="font-size: 10px" name="fa6-regular:clock" />
              {{ getTimeAgo((nowTime - time) / 1000) }} ago
            </span>
          </div>
        </div>
      </div>
      <div class="card-body pt-0">
        <GMapMap
          ref="map"
          :center="mapData"
          :zoom="config.zoomMap"
          map-type-id="terrain"
          style="width: auto; height: 400px"
        >
          <GMapMarker
            :position="mapData"
            :clickable="true"
            :draggable="false"
          ></GMapMarker>
        </GMapMap>
      </div>
    </div>
  </div>
</template>
