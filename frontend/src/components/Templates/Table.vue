<script setup lang="ts">
const { headers, templates, searchValue, handleDelete } = useTemplates();
</script>

<template>
  <div class="col-sm-12">
    <div class="card">
      <div class="card-header">
        <div class="row align-items-center">
          <div class="col-sm-9">
            <h5 class="mb-3 mb-sm-0 text-center text-sm-start">
              Lista de plantillas
            </h5>
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
            :items="templates"
            :search-value="searchValue"
            :rowsPerPage="10"
            alternating
            buttons-pagination
            show-index
            table-class-name="customize-table"
          >
            <template #header-widgets="item">
              <div class="header-center">{{ item.text }}</div>
            </template>
            <template #item-widgets="item">
              <div class="body-center">{{ item.widgets.length }}</div>
            </template>
            <template #header-counter="item">
              <div class="header-center">{{ item.text }}</div>
            </template>
            <template #item-counter="item">
              <div class="body-center">{{ item.counter }}</div>
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
              <p class="mt-3">No se encontraron plantillas registradas.</p>
            </template>
          </EasyDataTable>
        </div>
      </div>
    </div>
  </div>
</template>
