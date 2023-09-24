<script setup lang="ts">
useHead({
  titleTemplate: (title) => `Restablecer contraseña| ${title}`,
});
definePageMeta({
  layout: "custom",
  middleware: "no-auth",
});

const { forgot, submitted, forgot$, handleForgot } = useAuth();
</script>

<template>
  <div class="page-wrapper">
    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-12 login-form">
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
                  <h4 class="text-center mb-4">Restablecer contraseña</h4>
                  <p class="mb-4">
                    Ingresa tu correo electrónico registrado y recibirás
                    instrucciones para restablecer tu contraseña.
                  </p>
                  <div class="form-group mb-4">
                    <FormInput
                      v-model="forgot.email"
                      placeholder="test@correo.com"
                      forId="authEmail"
                      type="email"
                      :validate="forgot$.email.$error"
                    />
                    <div
                      v-if="submitted && forgot$.email.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="forgot$.email.required.$invalid">
                        El campo es requerido.
                      </span>
                      <span v-if="forgot$.email.email.$invalid">
                        El correo electrónico no es válido.
                      </span>
                    </div>
                  </div>
                  <div class="form-group mb-0">
                    <button
                      @click="handleForgot"
                      title="Restablecer contraseña"
                      class="btn btn-primary btn-block w-100"
                    >
                      Enviar
                    </button>
                  </div>
                  <p class="mt-4 mb-0 text-center">
                    ¿Ya tienes una contraseña?
                    <NuxtLink class="ms-2" to="/login">
                      Iniciar sesión
                    </NuxtLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
