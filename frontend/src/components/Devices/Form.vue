<script setup lang="ts">
const { users } = useUsers();

const {
  deviceForm,
  handleSelect,
  handleNewDevice,
  resetForm,
  selectTemplate,
  selectUser,
  submitted,
  templatesUser,
  v$,
} = useDevices();
</script>
<template>
  <div class="col-sm-12">
    <div class="card">
      <div class="d-flex gap-3 card-header">
        <h5 class="m-0 text-center text-sm-start">Agregar dispositivo</h5>
      </div>
      <div class="card-body">
        <div class="row g-3 mb-3">
          <div class="col-lg-6 col-md-6 col-sm-6">
            <label class="form-label">Usuarios</label>
            <multiselect
              class="multiselect-custom"
              v-model="selectUser"
              :options="users"
              track-by="email"
              label="email"
              placeholder="Seleccionar usuario"
              selectedLabel="Seleccionado"
              selectLabel="Seleccionar"
              deselectLabel="Remover"
              :show-no-results="false"
              @select="handleSelect"
            >
            </multiselect>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6">
            <FormSelect
              v-model="deviceForm.template"
              placeholder="Seleccionar Template"
              forId="userTemplate"
              labelInput="Template"
              :options="templatesUser"
              :validate="v$.template.$error"
            />
            <div
              v-if="submitted && v$.template.$error"
              class="invalid-feedback"
            >
              <span v-if="v$.template.required.$invalid">
                El campo es requerido.
              </span>
            </div>
          </div>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-lg-4 col-md-6 col-sm-6">
            <FormInput
              v-model="deviceForm.name"
              label="Nombre del dispositivo"
              forId="deviceName"
              :validate="v$.name.$error"
            />
            <div v-if="submitted && v$.name.$error" class="invalid-feedback">
              <span v-if="v$.name.required.$invalid">
                El campo es requerido.
              </span>
              <span v-if="v$.name.minLength.$invalid">
                El nombre debe contener mínimo 5 caracteres.
              </span>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6">
            <FormInput
              v-model="deviceForm.dId"
              label="ID del dispositivo"
              forId="deviceId"
              :validate="v$.dId.$error"
            />
            <div v-if="submitted && v$.dId.$error" class="invalid-feedback">
              <span v-if="v$.dId.required.$invalid">
                El campo es requerido.
              </span>
              <span
                v-if="v$.dId.minLength.$invalid || v$.dId.maxLength.$invalid"
              >
                El ID del dispositivo no es válido.
              </span>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6">
            <FormInput
              v-model="deviceForm.description"
              label="Descripción"
              forId="deviceDesc"
              :validate="v$.description.$error"
            />
            <div
              v-if="submitted && v$.description.$error"
              class="invalid-feedback"
            >
              <span v-if="v$.description.required.$invalid">
                El campo es requerido.
              </span>
              <span
                v-if="
                  v$.description.minLength.$invalid ||
                  v$.description.maxLength.$invalid
                "
              >
                El campo debe contener entre 5 a 50 caracteres.
              </span>
            </div>
          </div>
        </div>
        <button @click="handleNewDevice" class="btn btn-primary me-3 mt-3">
          Agregar
        </button>
        <button @click="resetForm" class="btn btn-secondary mt-3">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
