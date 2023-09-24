<script setup lang="ts">
import type { Header } from "vue3-easy-data-table";

const { datas, handleDeleteSensor } = useReports();

const searchValue = ref("");
const headers = ref<Header[]>([
  { text: "DISPOSITIVO", value: "dId" },
  { text: "VARIABLE", value: "variableName" },
  { text: "MEDIDA", value: "value" },
  { text: "FECHA", value: "fecha" },
  { text: "HORA", value: "hora" },
  { text: "ACCIONES", value: "operation" },
]);

const jsonFields = ref({
  Dispositivo: "dId",
  Variable: "variableName",
  Medida: "value",
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
              Registros de sensores
            </h5>
            <JsonExcel
              class="btn btn-success"
              :data="datas"
              :worksheet="datas[0]['variableName']"
              :name="`${datas[0]['variableName']}-data.xls`"
              :fields="jsonFields"
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
            buttons-pagination
            alternating
            show-index
            table-class-name="customize-table"
          >
            <template #item-operation="item">
              <div class="d-flex align-items-center actions-table gap-3">
                <div>
                  <a title="Eliminar registro" href="javascript:void(0)">
                    <Icon @click="handleDeleteSensor(item)" name="fa:trash-o" />
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
</template>
