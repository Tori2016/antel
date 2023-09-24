<script setup lang="ts">
const {
  alarms,
  headers,
  searchValue,
  showForm,
  handleDelete,
  updateAlarmRuleStatus,
} = useAlarms();
</script>

<template>
  <div class="col-sm-12">
    <div class="card">
      <div class="card-header">
        <div class="row align-items-center">
          <div class="d-flex align-items-center gap-3 col-sm-9 mb-3 mb-sm-0">
            <h5 class="text-center text-sm-start">Lista de Alarmas</h5>
            <button @click="showForm = !showForm" class="btn btn-primary">
              <Icon class="me-2" name="fa6-solid:plus" />
              Agregar alarma
            </button>
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
            :items="alarms"
            :search-value="searchValue"
            :rowsPerPage="10"
            buttons-pagination
            alternating
            show-index
            table-class-name="customize-table"
          >
            <template #item-alarmRule="item">
              <div class="d-flex align-items-center actions-table gap-3">
                <Icon
                  :class="{
                    'widget-secondary': item.status,
                    'widget-dark': !item.status,
                  }"
                  name="ic:sharp-notifications-active"
                />
                <div class="media-body text-end">
                  <label class="switch m-0">
                    <input
                      @click.prevent="updateAlarmRuleStatus(item)"
                      type="checkbox"
                      :checked="item.status"
                    />
                    <span class="switch-state"></span>
                  </label>
                </div>
              </div>
            </template>
            <template #item-operation="item">
              <div class="d-flex align-items-center actions-table gap-3">
                <div>
                  <a title="Eliminar registro" href="javascript:void(0)">
                    <Icon @click="handleDelete(item)" name="fa:trash-o" />
                  </a>
                </div>
              </div>
            </template>
            <template #loading>
              <Icon class="loading-table" name="svg-spinners:3-dots-scale" />
            </template>
            <template #empty-message>
              <p class="mt-3">No se encontraron alarmas registradas.</p>
            </template>
          </EasyDataTable>
        </div>
      </div>
    </div>
  </div>
</template>
