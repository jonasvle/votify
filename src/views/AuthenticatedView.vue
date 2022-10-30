<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <Sidebar />
  <section class="w-full ml-64">
    <main class="bg-gray-50">
      <router-view />
    </main>
  </section>
</template>
