<script setup lang="ts">
useHead({
  titleTemplate: (title) => `Crear nueva contraseña| ${title}`,
});
definePageMeta({
  layout: "custom",
  middleware: "no-auth",
});

const {
  newPass,
  submitted,
  newPass$,
  handleUpdate,
  active,
  show,
  verifyToken,
  isValidToken,
} = useAuth();

const route = useRoute();
const { token } = route.params as { token: string };

onMounted(() => {
  verifyToken(token);
});
</script>

<template>
  <div class="page-wrapper">
    <div class="container-fluid p-0">
      <div class="row">
        <div v-if="isValidToken" class="col-12 login-form">
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
                  <p class="mb-4">Ingresa tu nueva contraseña.</p>
                  <div class="form-group">
                    <label class="col-form-label">Nueva Constraseña</label>
                    <div class="form-input position-relative">
                      <input
                        v-model="newPass.password"
                        class="form-control"
                        :type="active ? 'password' : 'text'"
                        placeholder="*********"
                        :class="`${
                          newPass$.password.$error ? 'is-invalid' : ''
                        }`"
                      />
                      <div
                        v-if="submitted && newPass$.password.$error"
                        class="invalid-feedback"
                      >
                        <span v-if="newPass$.password.required.$invalid">
                          El campo es requerido.
                        </span>
                        <span v-if="newPass$.password.minLength.$invalid">
                          La contraseña debe tener mínimo 6 caracteres.
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
                  <div class="form-group mb-4">
                    <label class="col-form-label">Confirmar Constraseña</label>
                    <div class="form-input position-relative">
                      <input
                        v-model="newPass.confirmPassword"
                        class="form-control"
                        :type="active ? 'password' : 'text'"
                        placeholder="*********"
                        :class="`${
                          newPass$.confirmPassword.$error ? 'is-invalid' : ''
                        }`"
                      />
                      <div
                        v-if="submitted && newPass$.confirmPassword.$error"
                        class="invalid-feedback"
                      >
                        <span v-if="newPass$.confirmPassword.required.$invalid">
                          El campo es requerido.
                        </span>
                        <span
                          v-if="
                            newPass$.confirmPassword.sameAsPassword.$invalid
                          "
                        >
                          Las contraseñas no coinciden.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group mb-0">
                    <button
                      @click="handleUpdate(token)"
                      title="Restablecer contraseña"
                      class="btn btn-primary btn-block w-100"
                    >
                      Restablecer
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
        <div v-else class="col-12 login-form">
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
                  <h4 class="text-center mb-4">Token no válido</h4>
                  <p class="mb-4">
                    Lo sentimos el token no es válido o ya fue expirado,
                    recuerda que tienes 10 minutos para restablecer tu
                    contraseña una vez generado el token.
                  </p>
                  <p class="mt-4 mb-0 text-start">
                    ¿Deseas generar un nuevo token?
                    <NuxtLink class="" to="/forgot-password"
                      >clic aquí</NuxtLink
                    >
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
