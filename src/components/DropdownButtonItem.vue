<script setup lang="ts">
defineProps({
  important: Boolean,
});
</script>

<template>
  <li>
    <button
      class="w-full px-4 py-2 text-left hover:bg-gray-100"
      :class="{ 'text-red-700 font-semibold': important }"
    >
      <slot></slot>
    </button>
  </li>
</template>
