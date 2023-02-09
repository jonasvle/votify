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
  <div class="relative flex-grow max-w-xs ml-2">
    <div
      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    >
      <font-awesome-icon
        class="w-3 h-3 text-gray-500 sm:w-5 sm:h-5"
        icon="fa-solid fa-search"
      />
    </div>
    <input
      type="search"
      class="w-full p-2 pl-10 text-xs text-gray-900 border border-gray-300 rounded-lg sm:text-sm focus:ring-primary-500 focus:border-primary-500 focus-visible:outline-none"
      :placeholder="placeholder"
      v-model="searchValue"
      @keyup="onKeyup"
    />
  </div>
</template>
