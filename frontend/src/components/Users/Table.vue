<script setup lang="ts">
const { handleDelete, handleStatus, headers, searchValue, showForm, users } =
  useUsers();

const config = useRuntimeConfig();
</script>

<template>
  <div class="col-sm-12">
    <div class="card">
      <div class="card-header">
        <div class="row align-items-center">
          <div class="d-flex align-items-center gap-3 col-sm-9 mb-3 mb-sm-0">
            <h5 class="text-center text-sm-start">Lista de usuarios</h5>
            <button @click="showForm = !showForm" class="btn btn-primary">
              <Icon class="me-2" name="fa6-solid:plus" />
              Agregar usuario
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
            :items="users"
            :search-value="searchValue"
            :rowsPerPage="10"
            buttons-pagination
            alternating
            show-index
            table-class-name="customize-table"
          >
            <template #item-avatar="item">
              <div class="player-wrapper avatar-table">
                <img
                  v-if="item.avatar"
                  class="img-40 me-2 rounded-circle shadow-sm"
                  :src="config.public.getAvatarUri + item.avatar"
                  alt="Perfil"
                />
                <img
                  v-else
                  class="img-40 me-2 rounded-circle shadow-sm"
                  src="@/assets/img/avatar.png"
                  alt="Perfil"
                />
                {{ item.firstName }}
              </div>
            </template>
            <template #item-operation="item">
              <div class="d-flex align-items-center actions-table gap-3">
                <div class="media-body text-end">
                  <label class="switch m-0">
                    <input
                      :disabled="item.role === 'admin'"
                      type="checkbox"
                      @click.prevent="handleStatus(item)"
                      :checked="item.isActive"
                    />
                    <span
                      class="switch-state"
                      :class="`${item.role === 'admin' ? 'disabled' : ''}`"
                    ></span>
                  </label>
                </div>
                <div v-if="item.role != 'admin'">
                  <a title="Eliminar registro" href="javascript:void(0)">
                    <Icon @click="handleDelete(item)" name="fa:trash-o" />
                  </a>
                </div>
              </div>
            </template>
            <template #empty-message>
              <p class="mt-3">No se encontraron usuarios registrados.</p>
            </template>
          </EasyDataTable>
        </div>
      </div>
    </div>
  </div>
</template>
