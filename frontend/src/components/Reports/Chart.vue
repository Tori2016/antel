<script setup lang="ts">
const { datas, selectVariable } = useReports();
const isMounted = ref(false);

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

watch(
  datas,
  () => {
    if (datas.value.length > 0) {
      series.value[0].data = [];
      datas.value.forEach((element: any) => {
        var aux = [];
        aux.push(
          element.time + new Date().getTimezoneOffset() * 60 * 1000 * -1
        );
        aux.push(element.value);
        series.value[0].data.push(aux);
      });
      isMounted.value = true;
      series.value[0].name = `${selectVariable.value.variableFullName} ${selectVariable.value.unit}`;
    }
    window.dispatchEvent(new Event("resize"));
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="col-md-12">
    <div class="card">
      <div class="chart-widget-top">
        <div class="row card-body pb-0 m-0">
          <div class="col-xl-9 col-lg-8 col-9 p-0">
            <h6 class="mb-3">
              {{ selectVariable.variableFullName }}
            </h6>
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
  </div>
</template>
