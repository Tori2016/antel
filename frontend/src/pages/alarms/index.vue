<script setup lang="ts">
useHead({
  titleTemplate: (title) => `Gestión de Alarmas | ${title}`,
});

definePageMeta({
  middleware: ["auth", "is-user"],
});

const { showForm } = useAlarms();
</script>

<template>
  <BreadCrumbs title="Alarmas" />
  <div class="container-fluid">
    <div class="row">
      <AlarmsForm v-if="showForm" />
      <AlarmsTable />
    </div>
  </div>
</template>
