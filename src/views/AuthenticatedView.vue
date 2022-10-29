<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <Sidebar />
  <section class="w-full bg-gray-50">
    <main>
      <router-view />
    </main>
  </section>
</template>
