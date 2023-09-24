<template>
  <div class="col-md-12 text-start">
    <div class="card">
      <div class="card-header">
        <h5 class="card-title">Notificaciones</h5>
      </div>
      <div class="card-body btn-showcase">
        <button
          class="btn btn-success"
          type="button"
          @click="success"
          variant="success"
        >
          Success
        </button>

        <button class="btn btn-info" type="button" @click="info" variant="info">
          Info
        </button>

        <button
          class="btn btn-danger"
          type="button"
          @click="error"
          variant="danger"
        >
          Error
        </button>

        <button
          class="btn btn-warning"
          type="button"
          @click="warning"
          variant="warning"
        >
          Warning
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useToast } from "vue-toastification";
const toast = useToast();

const success = () => toast.success("You did it! 🎉");
const info = () => toast.info("You did it! 🎉");
const error = () => toast.error("You did it! 🎉");
const warning = () => toast.warning("You did it! 🎉");
</script>

<style>
.Vue-Toastification__icon {
  font-size: 24px;
}
</style>
