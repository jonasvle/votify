<script setup lang="ts">
import { ref } from "vue";

defineProps({
  placeholder: String,
});

const emit = defineEmits(["valueChanged"]);

const searchValue = ref("");

const onKeyup = () => {
  emit("valueChanged", searchValue.value);
};
</script>

<template>
  <div
    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
  >
    <font-awesome-icon
      class="w-5 h-5 text-gray-500"
      icon="fa-solid fa-search"
    />
  </div>
  <input
    type="search"
    class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 focus:ring-primary-500 focus:border-primary-500 focus-visible:outline-none"
    :placeholder="placeholder"
    v-model="searchValue"
    @keyup="onKeyup"
  />
</template>
