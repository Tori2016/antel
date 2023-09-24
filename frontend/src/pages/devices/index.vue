<script setup lang="ts">
useHead({
  titleTemplate: (title) => `Gestión de Dispositivos | ${title}`,
});
definePageMeta({
  middleware: "auth",
});

const { userRole } = useAuth();
const { showForm } = useDevices();
</script>

<template>
  <BreadCrumbs title="Dispositivos" />
  <div class="container-fluid">
    <div class="row">
      <DevicesForm v-if="showForm && userRole === 'admin'" />
      <DevicesTable />
    </div>
  </div>
</template>
