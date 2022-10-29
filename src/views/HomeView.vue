<script setup lang="ts">
import VoteTable from "@/components/VoteTable/VoteTable.vue";
</script>

<template>
  <div class="max-w-screen-lg p-8 m-auto">
    <section class="flex justify-between mb-4 text-gray-500 sm:text-lg">
      <h2 class="mb-4 text-4xl font-bold tracking-tight text-gray-900">
        Votes
      </h2>
      <button
        type="button"
        class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:outline-none"
      >
        + Add new vote
      </button>
    </section>
    <VoteTable />
  </div>
</template>
