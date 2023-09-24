<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMenuStore } from "@/store/menu";

const store = useMenuStore();
const { togglesidebar, activeoverlay } = storeToRefs(store);
const showOverlay = ref(false);
const toggleSidebar = () => {
  store.opensidebar();
};

// IoT MQTT
const { $listenOff } = useNuxtApp();
const { getNotifications } = useNotifications();
const { startMqttClient } = useMqttService();

onMounted(() => {
  if (window.innerWidth <= 991) {
    showOverlay.value = true;
    store.opensidebar();
  }

  getNotifications();

  setTimeout(() => {
    startMqttClient();
  }, 2000);
});

onBeforeUnmount(() => {
  $listenOff("mqtt-sender");
});
</script>

<template>
  <div class="page-wrapper compact-wrapper" id="pageWrapper">
    <div class="page-header" :class="`${togglesidebar ? 'close_icon' : ''}`">
      <Header />
    </div>

    <div class="page-body-wrapper">
      <div
        class="sidebar-wrapper stroke-svg"
        :class="`${togglesidebar ? 'close_icon' : ''}`"
      >
        <Sidebar />
      </div>

      <div class="page-body">
        <slot></slot>
      </div>

      <div>
        <Footer></Footer>
      </div>
    </div>

    <Teleport to="body">
      <TapTop />
    </Teleport>
  </div>
  <div
    @click="toggleSidebar"
    v-if="showOverlay"
    class="bg-overlay"
    :class="`${activeoverlay ? '' : 'active'}`"
  ></div>
</template>
