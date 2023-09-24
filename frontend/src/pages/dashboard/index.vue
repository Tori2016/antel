<script setup lang="ts">
import { IWidgetConfig } from "@/interfaces";

useHead({
  titleTemplate: (title) => `Tablero de Monitoreo | ${title}`,
});
definePageMeta({
  middleware: "auth",
});

const { userRole } = useAuth();
const { widgets, selectedDevice, devices } = useDevices();

const fixWidget = (widget: IWidgetConfig) => {
  var widgetCopy = JSON.parse(JSON.stringify(widget));

  widgetCopy.selectedDevice.dId = selectedDevice.value.dId;
  widgetCopy.selectedDevice.name = selectedDevice.value.name;
  widgetCopy.userId = selectedDevice.value.userId;

  if (widget.widget == "numberchart") {
    widgetCopy.demo = false;
  }

  if (widget.widget == "map") {
    widgetCopy.demo = false;
  }

  return widgetCopy;
};
</script>

<template>
  <BreadCrumbs title="Dashboard" />
  <div class="container-fluid">
    <div v-if="userRole === 'user'" class="row">
      <div
        v-if="devices.length > 0"
        v-for="(widget, index) in widgets"
        :key="index"
        :class="widget.column"
        class="mb-3"
      >
        <IotNumberChart
          v-if="widget.widget == 'numberchart'"
          :config="fixWidget(widget)"
          class="mb-3"
        />

        <IotIndicatorNum
          v-if="widget.widget == 'indicatorNum'"
          :config="fixWidget(widget)"
        />

        <IotIndicator
          v-if="widget.widget == 'indicator'"
          :config="fixWidget(widget)"
        />

        <IotMap v-if="widget.widget == 'map'" :config="fixWidget(widget)" />

        <IotSwitch
          v-if="widget.widget == 'switch'"
          :config="fixWidget(widget)"
        />

        <IotButton
          v-if="widget.widget == 'button'"
          :config="fixWidget(widget)"
        />
      </div>
      <div v-else class="col-sm-12">
        <div class="card">
          <div class="card-body">
            <span style="font-size: 16px" class="m-0 p-0"
              >No tienes dispositivos registrados.</span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-else class="row">
      <div class="col-sm-12 col-xl-6 box-col-6">Holaa dashboard del ADMIN</div>
    </div>
  </div>
</template>
