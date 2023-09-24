<script setup lang="ts">
const { handleLogout, loggedUser } = useAuth();
const config = useRuntimeConfig();
</script>

<template>
  <li class="profile-nav onhover-dropdown pe-0 py-0">
    <div
      class="media profile-media"
      id="dropdownProfile"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <img
        v-if="loggedUser?.avatar"
        class="b-r-10 img-40"
        :src="config.public.getAvatarUri + loggedUser.avatar"
        alt="Foto de perfil"
      />
      <img
        v-else
        class="img-40 rounded-circle shadow-sm"
        src="@/assets/img/avatar.png"
        alt="Perfil"
      />
      <div class="media-body">
        <span>{{ loggedUser.firstName }} {{ loggedUser.lastName }}</span>
        <p class="mb-0 font-roboto">
          {{ loggedUser.role }}
          <Icon class="f-light" name="ic:round-keyboard-arrow-down" />
        </p>
      </div>
    </div>
    <ul
      class="dropdown-menu profile-dropdown mt-3"
      aria-labelledby="dropdownProfile"
    >
      <li class="dropdown-list">
        <NuxtLink class="d-inline-block" to="/profile">
          <Icon class="icon-link" name="ph:user-circle-gear-light" />
          <span>Ver perfil</span>
        </NuxtLink>
      </li>
      <li @click="handleLogout" class="dropdown-list">
        <a class="d-inline-block">
          <Icon class="icon-link" name="ph:sign-out" />
          <span>Salir</span>
        </a>
      </li>
    </ul>
  </li>
</template>
