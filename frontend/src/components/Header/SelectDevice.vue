<script setup lang="ts">
const { userRole } = useAuth();
const { devices, selectDevice, handleSelectDevice } = useDevices();
</script>

<template>
  <div v-if="userRole === 'user'" style="width: 220px">
    <multiselect
      class="multiselect-custom"
      v-model="selectDevice"
      :options="devices"
      track-by="dId"
      label="name"
      placeholder="Seleccionar dispositivo"
      selectedLabel="Seleccionado"
      selectLabel="Seleccionar"
      deselectLabel="Remover"
      :show-no-results="false"
      @select="handleSelectDevice"
    >
    </multiselect>
  </div>
</template>
