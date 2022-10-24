<script setup lang="ts">
import { RouterView } from "vue-router";

import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <Sidebar />
  <section class="w-full">
    <Header />
    <main>
      <RouterView />
    </main>
  </section>
</template>
