<script setup lang="ts">
const { notification, notificationOpen, notificationReaded, notifications } =
  useNotifications();
</script>

<template>
  <li class="alarm-notifications onhover-dropdown p-0">
    <div class="notification-box">
      <svg @click="notificationOpen">
        <use href="@/assets/svg/icon-sprite.svg#notification"></use>
      </svg>
      <span
        v-if="notifications.length > 0"
        class="badge rounded-pill badge-secondary"
        >{{ notifications.length }}</span
      >
    </div>
    <div
      class="onhover-show-div notification-dropdown"
      :class="{ active: notification }"
    >
      <ul>
        <li
          title="Clic para eliminar notificación"
          v-if="notifications.length > 0"
          v-for="item in notifications"
          class="b-l-primary border-4"
          @click="notificationReaded(item)"
        >
          <p class="notif-date font-danger">
            {{ unixToDate(String(item.time)) }}, {{ formatTime(item.time) }}
          </p>
          <p><b>Dispositivo: </b>{{ item.deviceName }}</p>
          <p><b>Variable: </b>{{ item.variableFullName }}</p>
          <p><b>Medición: </b>{{ item.payload.value }} {{ item.unit }}</p>
          <p><b>Condición: </b>{{ item.condition }}</p>
          <p><b>Set Point: </b>{{ item.setPoint }} {{ item.unit }}</p>
        </li>
        <li v-else>No hay notificaciones de alarmas.</li>
      </ul>
    </div>
  </li>
</template>
