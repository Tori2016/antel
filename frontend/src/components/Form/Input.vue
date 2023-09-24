<script setup lang="ts">
interface Props {
  label?: string | boolean;
  forId?: string;
  placeholder?: string;
  modelValue?: string | number;
  validate?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <label v-if="label" :for="forId" class="form-label">{{ label }}</label>
  <input
    type="text"
    class="form-control"
    :class="`${validate ? 'is-invalid' : ''}`"
    :id="forId"
    :placeholder="placeholder"
    :value="modelValue"
    v-bind="$attrs"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>
