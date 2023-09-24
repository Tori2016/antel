<script setup>
import { useMenuStore } from "@/store/menu";

const { userRole } = useAuth();
const store = useMenuStore();

const toggleSidebar = () => {
  if (window.innerWidth <= 991) {
    store.opensidebar();
  }
};
</script>

<template>
  <nav class="sidebar-main" id="sidebar-main">
    <div class="left-arrow" id="left-arrow">
      <li class="left-arrow">
        <Icon name="ph:caret-left" />
      </li>
    </div>
    <div id="sidebar-menu">
      <ul
        @click="toggleSidebar"
        class="sidebar-links custom-scrollbar"
        id="myDIV"
        style="margin: 0px"
      >
        <li class="back-btn">
          <NuxtLink to="/">
            <img class="img-fluid" src="~/assets/img/logo/favicon.png" alt="" />
          </NuxtLink>
          <div class="mobile-back text-end">
            <span>Back</span>
            <Icon name="ph:caret-left" />
          </div>
        </li>

        <li>
          <NuxtLink to="/dashboard" class="sidebar-link sidebar-title">
            <Icon class="icon-link" name="ph:diamonds-four-light" />
            <span>Dashboard</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/devices" class="sidebar-link sidebar-title">
            <Icon class="icon-link" name="ph:cpu-light" />
            <span>Dispositivos</span>
          </NuxtLink>
        </li>

        <li v-if="userRole === 'user'">
          <NuxtLink to="/alarms" class="sidebar-link sidebar-title">
            <Icon class="icon-link" name="ph:bell-ringing-light" />
            <span>Alarmas</span>
          </NuxtLink>
        </li>

        <li v-if="userRole === 'user'">
          <NuxtLink to="/reports" class="sidebar-link sidebar-title">
            <Icon class="icon-link" name="ph:file-text-light" />
            <span>Reportes</span>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="/templates" class="sidebar-link sidebar-title">
            <Icon class="icon-link" name="ph:presentation-chart-light" />
            <span>Templates</span>
          </NuxtLink>
        </li>

        <li v-if="userRole === 'user'">
          <NuxtLink to="/device-status" class="sidebar-link sidebar-title">
            <Icon class="icon-link" name="ph:heartbeat-light" />
            <span>Estado dispositivo</span>
          </NuxtLink>
        </li>

        <!-- <li>
          <NuxtLink to="/settings" class="sidebar-link sidebar-title">
            <Icon class="icon-link" name="ph:gear-six-light" />
            <span>Configuración</span>
          </NuxtLink>
        </li> -->

        <li v-if="userRole === 'admin'">
          <NuxtLink to="/users" class="sidebar-link sidebar-title">
            <Icon class="icon-link" name="ph:users-three-light" />
            <span>Usuarios</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
