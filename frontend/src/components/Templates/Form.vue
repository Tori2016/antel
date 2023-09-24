<script setup lang="ts">
const { users } = useUsers();
const { widgets, submitted, templateForm, handleSubmit, selectUser, v$ } =
  useTemplates();
</script>
<template>
  <div class="col-sm-12">
    <div class="card">
      <div class="card-header">
        <h5 class="m-0 text-center text-sm-start">Agregar Template</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-lg-4 col-md-6 col-sm-6">
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
            >
            </multiselect>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6">
            <FormInput
              v-model="templateForm.name"
              label="Nombre del template"
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
          <div class="col-lg-4 col-md-12 col-sm-6">
            <FormInput
              v-model="templateForm.description"
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
        <button
          @click="handleSubmit"
          :disabled="widgets.length === 0"
          class="btn btn-primary mt-3"
        >
          Agregar
        </button>
      </div>
    </div>
  </div>
</template>
