<script setup lang="ts">
import type { Header } from "vue3-easy-data-table";

const { datas, handleDeleteGps, distance, centerMap } = useReports();

const searchValue = ref("");
const headers = ref<Header[]>([
  { text: "DISPOSITIVO", value: "dId" },
  { text: "VARIABLE", value: "variableName" },
  { text: "COORDENADAS", value: "position" },
  { text: "FECHA", value: "fecha" },
  { text: "HORA", value: "hora" },
  { text: "ACCIONES", value: "operation" },
]);

const jsonFields = ref({
  Dispositivo: "dId",
  Variable: "variableName",
  Latitud: "lat",
  Longitud: "lng",
  Fecha: "fecha",
  Hora: "hora",
});
</script>

<template>
  <div class="col-md-12">
    <div class="card">
      <div class="card-header">
        <div class="row align-items-center">
          <div class="col-sm-9 d-flex align-items-center gap-3">
            <h5 class="mb-3 mb-sm-0 text-center text-sm-start">
              Registros de GPS
            </h5>
            <JsonExcel
              class="btn btn-success"
              :data="datas"
              :worksheet="datas[0]['variableName']"
              :name="`${datas[0]['variableName']}-data.csv`"
              :fields="jsonFields"
              type="csv"
            >
              <Icon class="me-2" name="file-icons:microsoft-excel" />
              Export
            </JsonExcel>
          </div>
          <div class="col-sm-3">
            <div class="input-group input-search-table">
              <span class="input-group-text">
                <Icon name="mingcute:search-3-line" />
              </span>
              <input
                v-model="searchValue"
                class="form-control"
                type="text"
                placeholder="Buscar..."
              />
            </div>
          </div>
        </div>
      </div>
      <div class="card-block row">
        <div class="col-sm-12 col-lg-12 col-xl-12">
          <EasyDataTable
            class="table-responsive"
            :headers="headers"
            :items="datas"
            :search-value="searchValue"
            :rowsPerPage="10"
            alternating
            buttons-pagination
            show-index
            table-class-name="customize-table"
          >
            <template #item-position="item">
              {{ item.lat }}, {{ item.lng }}
            </template>
            <template #item-operation="item">
              <div class="d-flex align-items-center actions-table gap-3">
                <div>
                  <a title="Eliminar registro" href="javascript:void(0)">
                    <Icon @click="handleDeleteGps(item)" name="fa:trash-o" />
                  </a>
                </div>
              </div>
            </template>
            <template #empty-message>
              <p class="mt-3">No se encontraron registros.</p>
            </template>
          </EasyDataTable>
        </div>
      </div>
    </div>
  </div>

  <div class="col-md-12">
    <div class="card widget-card-h-report">
      <div class="chart-widget-top">
        <div class="row card-body pb-0 m-0">
          <div class="d-flex justify-content-between mb-3">
            <h5 class="mb-0">
              Distancia:
              <small>{{ (distance / 1000).toFixed(2) }} km</small>
            </h5>
            <h5 class="mb-0">Velocidad Min: <small>15 Km/h</small></h5>
            <h5 class="mb-0">Velocidad Max: <small>80 Km/h</small></h5>
          </div>
        </div>
        <div class="card-body pt-0">
          <GMapMap
            ref="mapReport"
            :center="centerMap"
            :zoom="14"
            map-type-id="terrain"
            style="width: auto; height: 500px"
          >
            <GMapMarker
              v-for="(marker, index) in datas"
              :key="index"
              :position="marker"
              :clickable="true"
              :draggable="false"
            ></GMapMarker>
          </GMapMap>
        </div>
      </div>
    </div>
  </div>
</template>
