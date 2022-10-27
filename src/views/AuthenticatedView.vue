<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <Sidebar />
  <section class="w-full">
    <Header />
    <main>
      <router-view />
    </main>
  </section>
</template>
