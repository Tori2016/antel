<script setup>
const mixLayout = ref("light-only");

const customizeMixLayout = (val) => {
  mixLayout.value = val;
  if (document.body.className === "box-layout") {
    document.body.className = "box-layout " + val;
  } else {
    document.body.className = val;
  }
};
</script>

<template>
  <li>
    <div class="mode" :class="mixLayout === 'dark-only' ? 'active' : ''">
      <svg
        v-show="mixLayout === 'light-only'"
        @click="customizeMixLayout('dark-only')"
      >
        <use href="@/assets/svg/icon-sprite.svg#moon"></use>
      </svg>

      <svg
        v-show="mixLayout === 'dark-only'"
        @click="customizeMixLayout('light-only')"
      >
        <use href="@/assets/svg/icon-sprite.svg#moon"></use>
      </svg>
    </div>
  </li>
</template>
