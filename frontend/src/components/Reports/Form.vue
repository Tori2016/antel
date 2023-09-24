<script setup lang="ts">
const {
  dataTimeFrom,
  dataTimeTo,
  getDataGps,
  getDataSensor,
  selectVariable,
  widgetsInput,
  clearData,
  preloading,
  datas,
} = useReports();
</script>
<template>
  <div class="col-md-12">
    <div class="card">
      <div class="d-flex gap-3 card-header">
        <h5 class="m-0 text-center text-sm-start">Buscar registros</h5>
      </div>
      <div class="card-body">
        <div class="row g-3 mb-3">
          <div class="col-lg-4 col-md-6 col-sm-6">
            <label class="form-label">Variable</label>
            <multiselect
              class="multiselect-custom"
              v-model="selectVariable"
              :options="widgetsInput"
              track-by="variable"
              label="variableFullName"
              placeholder="Seleccionar variable"
              selectedLabel="Seleccionada"
              selectLabel="Seleccionar"
              deselectLabel="Remover"
            >
            </multiselect>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6">
            <label class="form-label">Fecha y Hora DESDE</label>
            <input
              v-model="dataTimeFrom"
              class="form-control"
              type="datetime-local"
            />
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6">
            <label class="form-label">Fecha y Hora HASTA</label>
            <input
              v-model="dataTimeTo"
              class="form-control"
              type="datetime-local"
            />
          </div>
        </div>
        <template v-if="selectVariable">
          <button
            :disabled="preloading"
            @click="
              selectVariable.widget == 'map' ? getDataGps() : getDataSensor()
            "
            class="btn btn-primary me-3 mt-3"
          >
            Buscar registros
            <Icon
              v-if="preloading"
              class="ms-2"
              name="svg-spinners:6-dots-scale-middle"
            />
          </button>
          <button
            v-if="datas.length > 0"
            @click="clearData"
            class="btn btn-success me-3 mt-3"
          >
            Limpiar
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
