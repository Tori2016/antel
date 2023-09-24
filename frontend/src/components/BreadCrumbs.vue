<script setup lang="ts">
defineProps({
  title: String,
  main: String,
});
</script>

<template>
  <div class="container-fluid">
    <div class="page-title">
      <div class="row">
        <div class="col-6 d-flex">
          <h3>{{ title }}</h3>
        </div>
        <div class="col-6">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <NuxtLink :to="{ path: '/' }">
                <Icon class="f-light" name="ph:house-line" />
              </NuxtLink>
            </li>
            <li class="breadcrumb-item" v-if="main">{{ main }}</li>
            <li class="breadcrumb-item active" v-if="title">{{ title }}</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
