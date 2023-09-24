<script setup lang="ts">
useHead({
  titleTemplate: (title) => `Gestión de Reportes | ${title}`,
});
definePageMeta({
  middleware: ["auth", "is-user"],
});

const { datas } = useReports();
</script>

<template>
  <BreadCrumbs title="Reportes" />
  <div class="container-fluid">
    <div class="row">
      <ReportsForm />
      <template v-if="datas.length > 0 && datas[0]['type'] === 'sensor'">
        <ReportsChart />
        <ReportsTableSensors />
      </template>
      <template v-if="datas.length > 0 && datas[0]['type'] === 'gps'">
        <ReportsTableGps />
      </template>
    </div>
  </div>
</template>
