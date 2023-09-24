<script setup lang="ts">
useHead({
  titleTemplate: (title) => `Confirmar cuenta de correo electrónico| ${title}`,
});
definePageMeta({
  layout: "custom",
  middleware: "no-auth",
});

const route = useRoute();
const { token } = route.params as { token: string };

const { verifyAccount, isComfirmAccount } = useAuth();

onMounted(() => {
  verifyAccount(token);
});
</script>

<template>
  <div class="page-wrapper">
    <div class="container-fluid p-0">
      <div class="row">
        <div v-if="isComfirmAccount" class="col-12 login-form">
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
                  <h4 class="text-center mb-4">Bienvenido</h4>
                  <p class="mb-4">
                    Tu cuenta ha sido verificada correctamente. Ahora puedes
                    iniciar sesión y disfrutar de nuestra plataforma IoT.
                  </p>
                  <p class="mt-4 mb-0 text-start">
                    ¿Deseas iniciar sesión?
                    <NuxtLink class="" to="/login">clic aquí</NuxtLink>
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
                  <h4 class="text-center mb-4">Lo sentimos</h4>
                  <p class="mb-4">
                    Tu cuenta no pudo ser verificada, Por favor comunícate con
                    nosotros para darte una solución lo antes posible. Puedes
                    enviarnos un correo electrónico a
                    <a
                      title="Enviar correo a soporte@antel.com.co"
                      href="mailto:soporte@antel.com.co"
                      rel="noopener noreferrer"
                    >
                      soporte@antel.com.co</a
                    >.
                  </p>
                  <p class="mt-4 mb-0 text-start">
                    ¿Ya tienes una cuenta?
                    <NuxtLink class="" to="/login">Iniciar sesión</NuxtLink>
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
