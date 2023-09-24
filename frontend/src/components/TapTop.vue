<script setup>
import { useWindowScroll } from "@vueuse/core";

const display = ref(false);
const scrolled = ref(useWindowScroll().y);

watch(scrolled, () => {
  handleScroll();
});

const executeScroll = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

const handleScroll = () => {
  if (scrolled.value > 200) {
    display.value = true;
  } else {
    display.value = false;
  }
};
</script>

<template>
  <div
    class="tap-top"
    :style="[display ? { display: 'block' } : { display: 'none' }]"
  >
    <Icon @click="executeScroll" name="tabler:chevrons-up" />
  </div>
</template>
