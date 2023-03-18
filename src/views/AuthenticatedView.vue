<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "@/components/Sidebar.vue";

const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const closeSidebar = () => {
  showSidebar.value = false;
};
</script>

<template>
  <Sidebar
    v-if="showSidebar"
    @closeSidebar="closeSidebar"
    :show="showSidebar"
  />
  <section :class="{ 'lg:ml-64': showSidebar }">
    <main class="max-w-screen-lg p-8 m-auto bg-gray-50">
      <button
        @click="toggleSidebar"
        type="button"
        class="mb-3 text-primary-700 border border-primary-700 hover:bg-primary-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
      >
        <font-awesome-icon
          class="w-3 h-3 sm:w-5 sm:h-5"
          icon="fa-solid fa-bars"
        />
        <span class="sr-only">Open sidebar</span>
      </button>
      <router-view />
    </main>
  </section>
</template>
