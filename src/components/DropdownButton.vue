<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { Ref } from "vue";

const dropdownBtnRef: Ref<HTMLElement | null> = ref(null);
const showDropdown = ref(false);

const closeDropdown = (e: Event) => {
  if (!dropdownBtnRef.value?.contains(e.target as HTMLElement)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <div>
    <button
      ref="dropdownBtnRef"
      @click="showDropdown = !showDropdown"
      id="dropdownActionButton"
      data-dropdown-toggle="dropdownAction"
      class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5"
      type="button"
    >
      <span class="sr-only">Action button</span>
      Action
      <font-awesome-icon class="w-3 h-3 ml-2" icon="fa-solid fa-caret-down" />
    </button>
    <div
      id="dropdownAction"
      class="absolute z-10 translate-y-2 bg-white rounded shadow w-44"
      v-show="showDropdown"
    >
      <ul
        class="py-1 text-sm text-gray-700"
        aria-labelledby="dropdownActionButton"
      >
        <slot></slot>
      </ul>
    </div>
  </div>
</template>
