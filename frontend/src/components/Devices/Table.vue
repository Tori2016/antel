<script setup lang="ts">
const { userRole } = useAuth();
const {
  devices,
  handleDelete,
  headers,
  searchValue,
  showForm,
  updateSaveRuleStatus,
} = useDevices();
</script>

<template>
  <div class="col-sm-12">
    <div class="card">
      <div class="card-header">
        <div class="row align-items-center">
          <div class="d-flex align-items-center gap-3 col-sm-9 mb-3 mb-sm-0">
            <h5 class="text-center text-sm-start">Lista de dispositivos</h5>
            <button
              v-if="userRole === 'admin'"
              @click="showForm = !showForm"
              class="btn btn-primary"
            >
              <Icon class="me-2" name="fa6-solid:plus" />
              Agregar dispositivo
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
            :items="devices"
            :search-value="searchValue"
            :rowsPerPage="10"
            alternating
            buttons-pagination
            show-index
            table-class-name="customize-table"
          >
            <template #item-saveRule="item">
              <div class="d-flex align-items-center actions-table gap-3">
                <Icon
                  :class="{
                    'widget-secondary': item.saveRule.status,
                    'widget-dark': !item.saveRule.status,
                  }"
                  name="fa6-solid:database"
                />
                <div class="media-body text-end">
                  <label class="switch m-0">
                    <input
                      @click.prevent="updateSaveRuleStatus(item)"
                      type="checkbox"
                      :checked="item.saveRule.status"
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
            <template #empty-message>
              <p class="mt-3">No se encontraron dispositivos registrados.</p>
            </template>
          </EasyDataTable>
        </div>
      </div>
    </div>
  </div>
</template>
