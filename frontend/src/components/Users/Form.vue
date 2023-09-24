<script setup lang="ts">
const { roles, submitted, userForm, v$, resetForm, handleSubmit } = useUsers();
</script>
<template>
  <div class="col-sm-12">
    <div class="card">
      <div class="card-header">
        <h5 class="m-0 text-center text-sm-start">Agregar Usuario</h5>
      </div>
      <div class="card-body">
        <div class="row g-3 mb-3">
          <div class="col-lg-6 col-md-6 col-sm-6 mb-3">
            <FormInput
              v-model="userForm.firstName"
              label="Nombres"
              placeholder="Jesús"
              forId="userFirstName"
              :validate="v$.firstName.$error"
            />
            <div
              v-if="submitted && v$.firstName.$error"
              class="invalid-feedback"
            >
              <span v-if="v$.firstName.required.$invalid">
                El campo es requerido.
              </span>
              <span v-if="v$.firstName.minLength.$invalid">
                El campo debe contener mínimo 5 caracteres.
              </span>
            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 mb-3">
            <FormInput
              v-model="userForm.lastName"
              label="Apellidos"
              placeholder="Hernández"
              forId="userLastName"
              :validate="v$.lastName.$error"
            />
            <div
              v-if="submitted && v$.lastName.$error"
              class="invalid-feedback"
            >
              <span v-if="v$.lastName.required.$invalid">
                El campo es requerido.
              </span>
              <span v-if="v$.lastName.minLength.$invalid">
                El campo debe contener mínimo 5 caracteres.
              </span>
            </div>
          </div>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-lg-4 col-md-6 col-sm-6 mb-3">
            <FormInput
              v-model="userForm.email"
              label="Correo Electrónico"
              placeholder="test@correo.com"
              forId="userEmail"
              type="email"
              :validate="v$.email.$error"
            />
            <div v-if="submitted && v$.email.$error" class="invalid-feedback">
              <span v-if="v$.email.required.$invalid">
                El campo es requerido.
              </span>
              <span v-if="v$.email.email.$invalid">
                El correo electrónico no es válido.
              </span>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6 mb-3">
            <FormInput
              v-model="userForm.phone"
              label="Teléfono"
              placeholder="+57 316 000 0000"
              forId="userPhone"
              :validate="v$.phone.$error"
            />
            <div v-if="submitted && v$.phone.$error" class="invalid-feedback">
              <span v-if="v$.phone.required.$invalid">
                El campo es requerido.
              </span>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 col-sm-6 mb-3">
            <FormSelect
              v-model="userForm.role"
              placeholder="Seleccionar rol"
              forId="userRole"
              labelInput="Role"
              :options="roles"
              :validate="v$.role.$error"
            />
            <div v-if="submitted && v$.role.$error" class="invalid-feedback">
              <span v-if="v$.role.required.$invalid">
                El campo es requerido.
              </span>
            </div>
          </div>
        </div>
        <button @click="handleSubmit" class="btn btn-primary me-3 mt-3">
          Guardar
        </button>
        <button @click="resetForm" class="btn btn-secondary mt-3">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
