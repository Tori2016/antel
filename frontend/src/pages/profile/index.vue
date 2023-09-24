<script setup lang="ts">
useHead({
  titleTemplate: (title) => `Perfil de Usuario | ${title}`,
});
definePageMeta({
  middleware: "auth",
});

const { loggedUser } = useAuth();

const {
  config,
  deleteAvatar,
  getRole,
  handleImageSelected,
  imgAvatar,
  previewImage,
  uploadImage,
  newPass,
  v$,
  submitted,
  active,
  show,
  updatePassword,
} = useProfile();
</script>

<template>
  <BreadCrumbs title="Perfil de Usuario" />
  <div class="container-fluid">
    <div class="edit-profile">
      <div class="row">
        <div class="col-md-5">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Mi Perfil</h5>
            </div>
            <div class="card-body">
              <div class="row mb-2">
                <div class="profile-title">
                  <div class="media">
                    <div v-if="loggedUser.avatar" class="profile-pic-wrapper">
                      <div class="pic-holder">
                        <img
                          class="img-100 rounded-circle"
                          :src="config.public.getAvatarUri + loggedUser.avatar"
                          alt="Avatar"
                        />
                        <div @click="deleteAvatar" class="upload-file-block">
                          <div class="text-center">
                            <div class="mb-2">
                              <Icon class="fa-2x" name="ph:camera" />
                            </div>
                            <div class="text-uppercase">
                              Eliminar <br />
                              Avatar
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="profile-pic-wrapper">
                      <div class="pic-holder">
                        <img
                          class="pic"
                          :src="!previewImage ? imgAvatar : previewImage"
                          alt="avatar"
                        />
                        <input
                          class="uploadProfileInput"
                          type="file"
                          id="updateAvatar"
                          accept="image/*"
                          style="opacity: 0"
                          @change="handleImageSelected"
                        />
                        <label for="updateAvatar" class="upload-file-block">
                          <div class="text-center">
                            <div class="mb-2">
                              <Icon class="fa-2x" name="ph:camera" />
                            </div>
                            <div class="text-uppercase">
                              Subir <br />
                              Avatar
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div class="media-body">
                      <h5 class="mb-1 txt-primary">
                        {{ loggedUser.firstName }} {{ loggedUser.lastName }}
                      </h5>
                      <p>{{ getRole(loggedUser.role) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <input
                  v-model="loggedUser.email"
                  class="form-control"
                  disabled
                />
              </div>
              <div class="mb-3">
                <input
                  v-model="loggedUser.phone"
                  class="form-control"
                  disabled
                />
              </div>
              <div class="form-footer">
                <button @click="uploadImage" class="btn btn-primary btn-block">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-7">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Cambiar mi contraseña</h5>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label class="col-form-label">Constraseña Actual</label>
                <div class="form-input position-relative">
                  <input
                    v-model="newPass.oldPassword"
                    class="form-control"
                    :type="active ? 'password' : 'text'"
                    placeholder="*********"
                    :class="`${v$.oldPassword.$error ? 'is-invalid' : ''}`"
                  />
                  <div
                    v-if="submitted && v$.oldPassword.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="v$.oldPassword.required.$invalid">
                      El campo es requerido.
                    </span>
                    <span v-if="v$.oldPassword.minLength.$invalid">
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
              <div class="form-group">
                <label class="col-form-label">Nueva Constraseña</label>
                <div class="form-input position-relative">
                  <input
                    v-model="newPass.newPassword"
                    class="form-control"
                    :type="active ? 'password' : 'text'"
                    placeholder="*********"
                    :class="`${v$.newPassword.$error ? 'is-invalid' : ''}`"
                  />
                  <div
                    v-if="submitted && v$.newPassword.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="v$.newPassword.required.$invalid">
                      El campo es requerido.
                    </span>
                    <span v-if="v$.newPassword.minLength.$invalid">
                      La contraseña debe tener mínimo 6 caracteres.
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
                    :class="`${v$.confirmPassword.$error ? 'is-invalid' : ''}`"
                  />
                  <div
                    v-if="submitted && v$.confirmPassword.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="v$.confirmPassword.required.$invalid">
                      El campo es requerido.
                    </span>
                    <span v-if="v$.confirmPassword.sameAsPassword.$invalid">
                      Las contraseñas no coinciden.
                    </span>
                  </div>
                </div>
              </div>
              <div class="form-footer">
                <button
                  @click="updatePassword"
                  class="btn btn-primary btn-block"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
