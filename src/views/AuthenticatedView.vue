<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <Sidebar />
  <section class="w-full">
    <main class="bg-gray-50">
      <router-view />
    </main>
  </section>
</template>
