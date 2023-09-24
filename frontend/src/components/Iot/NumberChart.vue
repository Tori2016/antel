<script setup lang="ts">
import type { IWidgetConfig } from "@/interfaces";
import datasApi from "@/api/datasApi";

const props = defineProps<{ config: IWidgetConfig }>();

const { $listenOn, $listenOff } = useNuxtApp();
const { accessToken } = useAuth();

const chartData = ref<number>(0);
const time = ref(Date.now());
const nowTime = ref(Date.now());
const isMounted = ref(false);
const topic = ref<string>("");

const chartOptions = ref({
  chart: {
    id: "vuechart-example",
    height: 400,
    type: "line",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: true,
    },
  },
  dataLabels: {
    enabled: false,
    style: {
      fontSize: "10px",
      fontFamily: "Rubik, sans-serif",
      fontWeight: "bold",
    },
  },
  markers: {
    size: 0,
    shape: "circle",
    hover: {
      size: 5,
    },
  },
  stroke: {
    curve: "straight",
    width: 2,
  },
  tooltip: {
    enabled: true,
    x: {
      show: true,
      format: "dd/MM/yy HH:mm:ss",
    },
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "15px",
    fontFamily: "Rubik, sans-serif",
    fontWeight: 500,
    offsetY: 10,
  },
  colors: ["#7366ff"],
  xaxis: {
    type: "datetime",
    tooltip: {
      enabled: false,
    },
    crosshairs: {
      show: false,
    },
  },
});

const series = ref([
  {
    name: "",
    data: [[0, 0]],
  },
]);

// Methods
const getChartData = async () => {
  if (props.config.demo) {
    series.value[0].data = [
      [1606659071668, 34],
      [1606659072668, 43],
      [1606659073668, 31],
      [1606659074668, 43],
      [1606659075668, 33],
      [1606659076668, 52],
    ];
    isMounted.value = true;
    return;
  }

  try {
    const params = {
      dId: props.config.selectedDevice.dId,
      variable: props.config.variable,
      chartTimeAgo: props.config.chartTimeAgo,
    };
    const { data } = await datasApi.getChartDatas(params, accessToken.value);
    if (data) {
      series.value[0].data = [];
      data.forEach((element: any) => {
        var aux = [];
        aux.push(
          element.time + new Date().getTimezoneOffset() * 60 * 1000 * -1
        );
        aux.push(element.value.value);
        series.value[0].data.push(aux);
      });

      isMounted.value = true;
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

const processReceivedData = (data: any) => {
  try {
    time.value = Date.now();
    chartData.value = data.value;
    setTimeout(() => {
      if (data.save === 1) {
        getChartData();
      }
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

const updateColorClass = () => {
  const c = props.config.class;

  if (c === "primary") {
    chartOptions.value.colors[0] = "#7366ff";
  }
  if (c === "secondary") {
    chartOptions.value.colors[0] = "#ff3364";
  }
  if (c === "success") {
    chartOptions.value.colors[0] = "#54ba4a";
  }
  if (c === "warning") {
    chartOptions.value.colors[0] = "#ffaa05";
  }

  series.value[0].name = `${props.config.variableFullName} ${props.config.unit}`;
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
  updateColorClass();
});

onBeforeUnmount(() => {
  $listenOff(`${topic.value}/sdata`);
});

watch(
  props,
  () => {
    setTimeout(() => {
      chartData.value = 0;
      $listenOff(`${topic.value}/sdata`);

      topic.value = `${props.config.userId}/${props.config.selectedDevice.dId}/${props.config.variable}`;
      $listenOn(`${topic.value}/sdata`, (data) => processReceivedData(data));

      series.value[0].data = [];

      getChartData();
      updateColorClass();
      window.dispatchEvent(new Event("resize"));
    }, 300);
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="card widget-card-h">
    <div class="chart-widget-top">
      <div class="row card-body pb-0 m-0">
        <div class="col-xl-9 col-lg-8 col-9 p-0">
          <h6 class="mb-3">
            {{ config.selectedDevice.name }} -
            {{ config.variableFullName }}
          </h6>
          <div class="d-flex align-items-center gap-2">
            <Icon
              :class="getIconColorClass()"
              class="fs-3"
              :name="config.icon"
            />
            <h4 class="fw-normal m-0 p-0">
              {{ chartData.toFixed(config.decimalPlaces) }} {{ config.unit }}
            </h4>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-3 p-0">
          <div class="d-flex justify-content-end gap-2">
            <span style="font-size: 13px" class="fw-normal m-0 p-0">
              <Icon style="font-size: 10px" name="fa6-regular:clock" />
              {{ getTimeAgo((nowTime - time) / 1000) }} ago
            </span>
          </div>
        </div>
      </div>
      <div class="card-body pt-0">
        <apexchart
          v-if="isMounted"
          type="line"
          height="350"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </div>
  </div>
</template>
