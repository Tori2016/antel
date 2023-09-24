<script setup>
import { useMenuStore } from "@/store/menu";

const store = useMenuStore();

const toggleSidebar = () => {
  store.opensidebar();
};
</script>

<template>
  <div>
    <div class="logo-wrapper">
      <div class="d-flex justify-content-between">
        <SidebarLogo />
        <div class="back-btn" @click="toggleSidebar">
          <i class="fa fa-angle-left"></i>
        </div>
      </div>
      <div class="toggle-sidebar" @click="toggleSidebar">
        <Icon name="radix-icons:dashboard" />
      </div>
    </div>
    <div class="logo-icon-wrapper">
      <NuxtLink to="/">
        <img
          width="35"
          class="img-fluid"
          src="~/assets/img/logo/favicon.png"
          alt="Logo Antel"
        />
      </NuxtLink>
    </div>
    <SidebarNav />
  </div>
</template>
