<script setup lang="ts">
defineProps({
  error: String,
});
</script>

<template>
  <div v-if="error">
    <div
      v-if="error"
      class="flex items-center p-4 text-sm text-red-700 bg-red-100 rounded-lg"
      role="alert"
    >
      <font-awesome-icon
        class="w-4 h-4 mr-2"
        icon="fa-solid fa-circle-exclamation"
      />
      {{ error }}
    </div>
  </div>
</template>
