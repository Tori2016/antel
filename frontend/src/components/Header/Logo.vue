<script setup>
import { useMenuStore } from "@/store/menu";

const store = useMenuStore();

const toggleSidebar = () => {
  store.opensidebar();
};
</script>

<template>
  <div class="header-logo-wrapper col-auto p-0">
    <div class="toggle-sidebar" @click="toggleSidebar">
      <Icon name="ph:text-align-center" />
    </div>
  </div>
</template>
