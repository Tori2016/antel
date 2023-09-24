<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";

interface IOption {
  value: string | number;
  label: string;
  icon?: string;
}

interface Props {
  options: IOption[];
  modelValue?: string | number;
  labelInput?: string | boolean;
  forId?: string;
  placeholder?: string;
  validate?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits(["update:modelValue"]);

const label = computed(() => {
  return props.options
    .filter((option) => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(option.value);
      }
      return props.modelValue === option.value;
    })
    .map((option) => option.label)
    .join(",");
});

const icon = computed(() => {
  return props.options
    .filter((option) => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(option.value);
      }
      return props.modelValue === option.value;
    })
    .map((option) => option.icon)
    .join(",");
});
</script>

<template>
  <Listbox
    :model-value="modelValue"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <label v-if="labelInput" :for="forId" class="form-label">
      {{ labelInput }}
    </label>

    <ListboxButton
      :class="`${validate ? 'is-invalid' : ''}`"
      :id="forId"
      class="form-control select-cusom text-start"
    >
      <div v-if="label">
        <span>{{ label }}</span>
        <Icon v-if="icon" class="ms-2" :name="icon" />
      </div>
      <div v-else class="d-flex justify-content-between align-items-center">
        <span class="text-muted">{{ placeholder }}</span>
        <Icon class="f-12 text-muted" name="fa6-solid:chevron-down" />
      </div>
    </ListboxButton>

    <ListboxOptions
      v-if="options.length === 0"
      class="list-options mt-2 border border-1 rounded"
    >
      <ListboxOption disabled>
        <li class="py-2 px-3 cursor-default">
          <span class="fw-normal">Lista vacía</span>
        </li>
      </ListboxOption>
    </ListboxOptions>

    <ListboxOptions v-else class="list-options mt-2 border border-1 rounded">
      <ListboxOption
        v-for="(option, index) in options"
        :key="index"
        v-slot="{ active, selected }"
        :value="option.value"
      >
        <li
          class="py-2 px-3 cursor-default"
          :class="[active ? 'text-light bg-primary' : '']"
        >
          <span class="me-2" v-if="selected">
            <Icon class="f-12" name="fa6-solid:check" />
          </span>
          <span :class="[selected ? 'fw-bold' : 'fw-normal']">
            {{ option.label }}
          </span>
          <Icon v-if="option.icon" class="ms-2" :name="option.icon" />
        </li>
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>
