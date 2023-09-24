<script setup lang="ts">
useHead({
  titleTemplate: (title) => `Iniciar sesión| ${title}`,
});
definePageMeta({
  layout: "custom",
  middleware: "no-auth",
});
const { auth, submitted, v$, active, show, handleSubmit } = useAuth();
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 p-0 login-form">
        <div class="login-card">
          <div>
            <div class="mb-4">
              <div class="logo text-center">
                <img
                  class="img-fluid"
                  src="~/assets/img/logo/logo-antel-black.png"
                  alt="Logotipo Antel"
                  width="180"
                />
              </div>
            </div>
            <div class="login-main">
              <div class="theme-form">
                <h4 class="text-center mb-4">Iniciar sesión</h4>
                <p class="mb-4">Ingresa correo electrónico y contraseña</p>
                <div class="form-group">
                  <FormInput
                    v-model="auth.email"
                    label="Correo Electrónico"
                    placeholder="test@correo.com"
                    forId="authEmail"
                    type="email"
                    :validate="v$.email.$error"
                  />
                  <div
                    v-if="submitted && v$.email.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="v$.email.required.$invalid">
                      El campo es requerido.
                    </span>
                    <span v-if="v$.email.email.$invalid">
                      El correo electrónico no es válido.
                    </span>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Constraseña</label>
                  <div class="form-input position-relative">
                    <input
                      v-model="auth.password"
                      class="form-control"
                      :type="active ? 'password' : 'text'"
                      placeholder="*********"
                      :class="`${v$.password.$error ? 'is-invalid' : ''}`"
                    />
                    <div
                      v-if="submitted && v$.password.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="v$.password.required.$invalid">
                        El campo es requerido.
                      </span>
                    </div>
                    <div class="show-hide-password">
                      <span v-if="active" title="Mostrar contraseña">
                        <Icon
                          @click.prevent="show"
                          class="txt-primary"
                          name="fa6-regular:eye"
                        />
                      </span>
                      <span v-else title="Ocultar contraseña">
                        <Icon
                          @click.prevent="show"
                          name="fa6-regular:eye-slash"
                          class="txt-primary"
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-0">
                  <div class="checkbox p-0">
                    <input id="checkbox1" type="checkbox" />
                    <label class="text-muted" for="checkbox1"
                      >Recordar datos</label
                    >
                  </div>
                  <NuxtLink
                    title="Recuperar contraseña"
                    class="link"
                    to="/forgot-password"
                  >
                    ¿Olvidaste la contraseña?
                  </NuxtLink>
                  <div class="text-end mt-3">
                    <button
                      @click="handleSubmit"
                      title="Iniciar sesión"
                      class="btn btn-primary btn-block w-100"
                    >
                      Iniciar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
