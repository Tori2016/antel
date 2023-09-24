<script setup lang="ts">
import { VueDraggableNext as draggable } from "vue-draggable-next";

useHead({
  titleTemplate: (title) => `Gestión de Templates | ${title}`,
});
definePageMeta({
  middleware: "auth",
});
const { userRole } = useAuth();

const {
  addNewWidget,
  colorsSelect,
  columnSelect,
  deleteWidget,
  iconsSelect,
  iotButtonConfig,
  IotChartConfig,
  iotIndicatorConfig,
  iotIndicatorNumConfig,
  iotMapConfig,
  iotSwitchConfig,
  resetForm,
  widgets,
  widgetsSelect,
  widgetType,
} = useTemplates();

onMounted(() => {
  resetForm();
});
</script>

<template>
  <BreadCrumbs title="Templates" />
  <div class="container-fluid">
    <div class="row">
      <!-- WIDGET CONFIGURATOR -->
      <div v-if="userRole === 'admin'" class="col-sm-12">
        <div class="card">
          <div class="card-header">
            <h5>Crear Template</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- WIDGET SELECTOR AND FORMS -->
              <div class="col-md-6">
                <FormSelect
                  v-model="widgetType"
                  placeholder="Seleccionar Widget"
                  :options="widgetsSelect"
                />

                <!-- FORMS NUMBER CHART TYPE -->
                <div v-if="widgetType === 'numberchart'">
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="IotChartConfig.variableFullName"
                      type="text"
                      label="Variable"
                      forId="chartVariable"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="IotChartConfig.unit"
                      type="text"
                      label="Medida"
                      forId="chartMeasure"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <label for="chartDecimal" class="form-label"
                      >Número de decimales</label
                    >
                    <input
                      v-model.number="IotChartConfig.decimalPlaces"
                      id="chartDecimal"
                      type="number"
                      class="form-control"
                      max="3"
                      min="0"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="IotChartConfig.variableSendFreq"
                      type="number"
                      label="Tiempo de envío (s)"
                      forId="chartSendFreq"
                      min="1"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <label for="chartTimeAgo" class="form-label">
                      Tiempo gráfica (min)
                    </label>
                    <input
                      v-model.number="IotChartConfig.chartTimeAgo"
                      id="chartTimeAgo"
                      type="number"
                      class="form-control"
                      min="1"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="IotChartConfig.icon"
                      placeholder="Seleccionar Icono"
                      labelInput="Seleccionar Icono"
                      forId="chartIcon"
                      :options="iconsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="IotChartConfig.class"
                      placeholder="Seleccionar Color"
                      labelInput="Seleccionar Color"
                      forId="chartColor"
                      :options="colorsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="IotChartConfig.column"
                      placeholder="Seleccionar Tamaño"
                      labelInput="Seleccionar Tamaño"
                      forId="chartColumn"
                      :options="columnSelect"
                    />
                  </div>
                </div>

                <!-- FORM INDICATORNUM TYPE -->
                <div v-if="widgetType === 'indicatorNum'">
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotIndicatorNumConfig.variableFullName"
                      type="text"
                      label="Variable"
                      forId="indicatorNumVariable"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotIndicatorNumConfig.unit"
                      type="text"
                      label="Medida"
                      forId="indicatorNumUnit"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <label for="indicatorNumDecimal" class="form-label"
                      >Número de decimales</label
                    >
                    <input
                      v-model.number="iotIndicatorNumConfig.decimalPlaces"
                      id="indicatorNumDecimal"
                      type="number"
                      class="form-control"
                      max="3"
                      min="0"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotIndicatorNumConfig.variableSendFreq"
                      type="number"
                      label="Tiempo de envío (s)"
                      forId="IndicatorNumSendFreq"
                      min="1"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotIndicatorNumConfig.icon"
                      placeholder="Seleccionar Icono"
                      labelInput="Seleccionar Icono"
                      forId="indicatorNumIcon"
                      :options="iconsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotIndicatorNumConfig.class"
                      placeholder="Seleccionar Color"
                      labelInput="Seleccionar Color"
                      forId="indicatorNumColor"
                      :options="colorsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotIndicatorNumConfig.column"
                      placeholder="Seleccionar Tamaño"
                      labelInput="Seleccionar Tamaño"
                      forId="indicatorNumColumn"
                      :options="columnSelect"
                    />
                  </div>
                </div>

                <!-- FORM INDICATOR TYPE -->
                <div v-if="widgetType === 'indicator'">
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotIndicatorConfig.variableFullName"
                      type="text"
                      label="Variable"
                      forId="indicatorVariable"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotIndicatorConfig.icon"
                      placeholder="Seleccionar Icono"
                      labelInput="Seleccionar Icono"
                      forId="indicatorIcon"
                      :options="iconsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotIndicatorConfig.class"
                      placeholder="Seleccionar Color"
                      labelInput="Seleccionar Color"
                      forId="indicatorColor"
                      :options="colorsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotIndicatorConfig.column"
                      placeholder="Seleccionar Tamaño"
                      labelInput="Seleccionar Tamaño"
                      forId="indicatorColumn"
                      :options="columnSelect"
                    />
                  </div>
                </div>

                <!-- FORM MAP TYPE -->
                <div v-if="widgetType == 'map'">
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotMapConfig.variableFullName"
                      type="text"
                      label="Nombre Mapa"
                      forId="mapName"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotMapConfig.variableSendFreq"
                      type="number"
                      label="Tiempo de envío (s)"
                      forId="mapSendFreq"
                      min="1"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <label for="mapZoom" class="form-label"
                      >Zoom del mapa</label
                    >
                    <input
                      v-model.number="iotMapConfig.zoomMap"
                      id="mapZoom"
                      type="number"
                      class="form-control"
                      min="1"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotMapConfig.icon"
                      placeholder="Seleccionar Icono"
                      labelInput="Seleccionar Icono"
                      forId="mapIcon"
                      :options="iconsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotMapConfig.column"
                      placeholder="Seleccionar Tamaño"
                      labelInput="Seleccionar Tamaño"
                      forId="mapColumn"
                      :options="columnSelect"
                    />
                  </div>
                </div>

                <!-- FORM SWITCH TYPE -->
                <div v-if="widgetType === 'switch'">
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotSwitchConfig.variableFullName"
                      type="text"
                      label="Variable"
                      forId="switchVariable"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotSwitchConfig.icon"
                      placeholder="Seleccionar Icono"
                      labelInput="Seleccionar Icono"
                      forId="switchIcon"
                      :options="iconsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotSwitchConfig.class"
                      placeholder="Seleccionar Color"
                      labelInput="Seleccionar Color"
                      forId="switchColor"
                      :options="colorsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotSwitchConfig.column"
                      placeholder="Seleccionar Tamaño"
                      labelInput="Seleccionar Tamaño"
                      forId="switchColumn"
                      :options="columnSelect"
                    />
                  </div>
                </div>

                <!-- FORM BUTTON TYPE -->
                <div v-if="widgetType === 'button'">
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotButtonConfig.variableFullName"
                      type="text"
                      label="Variable"
                      forId="buttonVariable"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotButtonConfig.message"
                      type="text"
                      label="Mensaje para enviar"
                      forId="buttonMessage"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormInput
                      v-model="iotButtonConfig.text"
                      type="text"
                      label="Texto del botón"
                      forId="buttonTextBtn"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotButtonConfig.icon"
                      placeholder="Seleccionar Icono"
                      labelInput="Seleccionar Icono"
                      forId="buttonIcon"
                      :options="iconsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotButtonConfig.class"
                      placeholder="Seleccionar Color"
                      labelInput="Seleccionar Color"
                      forId="buttonColor"
                      :options="colorsSelect"
                    />
                  </div>
                  <div class="col-12 mt-3">
                    <FormSelect
                      v-model="iotButtonConfig.column"
                      placeholder="Seleccionar Tamaño"
                      labelInput="Seleccionar Tamaño"
                      forId="buttonColumn"
                      :options="columnSelect"
                    />
                  </div>
                </div>
              </div>

              <!-- WIDGET PREVIEW -->
              <div class="col-md-6">
                <IotNumberChart
                  v-if="widgetType == 'numberchart'"
                  :config="IotChartConfig"
                />

                <IotIndicatorNum
                  v-if="widgetType == 'indicatorNum'"
                  :config="iotIndicatorNumConfig"
                />

                <IotIndicator
                  v-if="widgetType === 'indicator'"
                  :config="iotIndicatorConfig"
                />

                <IotMap v-if="widgetType === 'map'" :config="iotMapConfig" />

                <IotSwitch
                  v-if="widgetType === 'switch'"
                  :config="iotSwitchConfig"
                />

                <IotButton
                  v-if="widgetType === 'button'"
                  :config="iotButtonConfig"
                />
              </div>

              <div class="col-md-12 text-center mt-4">
                <button @click="addNewWidget" class="btn btn-primary mt-3">
                  Agregar Widget
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DASHBOARD PREVIEW & FORM TEMPLATE-->
      <template v-if="widgets.length > 0 && userRole === 'admin'">
        <draggable class="row dashboard-preview" :list="widgets">
          <div
            v-for="(item, index) in widgets"
            :key="index"
            :class="[item.column]"
          >
            <div class="text-end">
              <button
                type="button"
                title="Eliminar Widget"
                class="bg-transparent border-0 mb-1"
                @click="deleteWidget(index)"
              >
                <Icon class="txt-danger" name="fa6-solid:trash-can" />
              </button>
            </div>

            <IotNumberChart
              v-if="item.widget == 'numberchart'"
              :config="item"
            />

            <IotIndicatorNum
              v-if="item.widget == 'indicatorNum'"
              :config="item"
            />

            <IotIndicator v-if="item.widget == 'indicator'" :config="item" />

            <IotMap v-if="item.widget == 'map'" :config="item" />

            <IotSwitch v-if="item.widget == 'switch'" :config="item" />

            <IotButton v-if="item.widget == 'button'" :config="item" />
          </div>
        </draggable>
        <TemplatesForm />
      </template>

      <!-- TEMPLATES TABLE -->
      <TemplatesTable />
    </div>
  </div>
</template>
