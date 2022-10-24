<script setup lang="ts">
const pages = [
  {
    name: "Votes",
    icon: "fa-solid fa-check-to-slot",
    to: "/",
  },
  {
    name: "Members",
    icon: "fa-solid fa-users",
    to: "/members",
  },
];
</script>

<template>
  <aside class="flex h-full border-r border-gray-200" aria-label="Sidebar">
    <div
      class="flex justify-center flex-col h-full overflow-y-auto py-4 px-3 bg-white"
    >
      <ul class="space-y-2 text-gray-500">
        <li v-for="page in pages" :key="page.name">
          <router-link
            exact-active-class="bg-primary-600 text-white"
            class="flex items-center p-2 rounded-lg hover:bg-primary-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300"
            :to="page.to"
          >
            <font-awesome-icon class="w-6 h-6" :icon="page.icon" />
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>
