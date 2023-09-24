<script setup lang="ts">
useHead({
  titleTemplate: (title) => `Gestión de Usuarios | ${title}`,
});
definePageMeta({
  middleware: ["auth", "is-admin"],
});
const { showForm, resetForm } = useUsers();

onBeforeUnmount(() => {
  resetForm();
});
</script>

<template>
  <BreadCrumbs title="Usuarios" />
  <div class="container-fluid">
    <div class="row">
      <UsersForm v-if="showForm" />
      <UsersTable />
    </div>
  </div>
</template>
