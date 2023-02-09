<script setup lang="ts">
import { ref, type Ref } from "vue";

import MemberTable from "@/components/Members/MemberTable.vue";
import MemberCreateModal from "@/components/Members/MemberCreateModal.vue";

const memberCreateModalRef: Ref<typeof MemberCreateModal | null> = ref(null);

const openCreateModal = () => {
  memberCreateModalRef.value?.openModal();
};
</script>

<template>
  <div>
    <section class="flex justify-between mb-4 text-gray-500 sm:text-lg">
      <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Members
      </h2>
      <button
        type="button"
        class="ml-3 inline-flex items-center px-3 sm:px-5 py-2 sm:py-2.5 mb-auto text-xs sm:text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 focus:outline-none"
        @click="openCreateModal"
      >
        <font-awesome-icon
          class="w-3 h-3 mr-2 -ml-1 sm:w-5 sm:h-5"
          icon="fa-solid fa-plus"
        />
        Add new member
      </button>
    </section>
    <MemberTable />
    <MemberCreateModal ref="memberCreateModalRef" />
  </div>
</template>
