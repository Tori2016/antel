<script setup lang="ts">
const { userRole } = useAuth();
</script>

<template>
  <div class="header-wrapper row m-0">
    <HeaderLogo />
    <div
      class="nav-right col-xxl-10 col-xl-10 col-md-8 col-10 pull-right right-header p-0 ms-auto"
    >
      <ul class="nav-menus gap-3">
        <HeaderSelectDevice />
        <HeaderMode />
        <HeaderNotifications v-if="userRole === 'user'" />
        <HeaderProfile />
      </ul>
    </div>
  </div>
</template>
