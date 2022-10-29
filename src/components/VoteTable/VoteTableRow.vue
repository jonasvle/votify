<script setup lang="ts">
import { ref, watch, type PropType } from "vue";

import { STATUS, type Vote } from "@/common/interfaces";
import { getDateString } from "@/common/utils";

const props = defineProps({
  checked: {
    type: Boolean,
  },
  vote: {
    type: Object as PropType<Vote>,
    required: true,
  },
});

const emit = defineEmits(["checkedChanged", "editClicked", "viewClicked"]);

const isChecked = ref(false);
watch(isChecked, (newStatus) => {
  emit("checkedChanged", newStatus);
});

const statusColor = () => {
  switch (props.vote.status) {
    case STATUS.CREATED:
      return "bg-gray-400";
    case STATUS.ACTIVE:
      return "bg-green-400";
    case STATUS.CLOSED:
      return "bg-red-400";
  }
};
</script>

<template>
  <tr class="bg-white border-b hover:bg-gray-50">
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          type="checkbox"
          class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2"
          v-model="isChecked"
        />
      </div>
    </td>
    <th
      scope="row"
      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
    >
      {{ vote.name }}
    </th>
    <td class="px-6 py-4">{{ getDateString(vote.creationDate) }}</td>
    <td class="px-6 py-4">
      <div class="flex items-center">
        <div class="h-2.5 w-2.5 rounded-full mr-2" :class="statusColor()"></div>
        {{ vote.status }}
      </div>
    </td>
    <td class="flex items-center px-6 py-4 space-x-3">
      <button
        @click="$emit('editClicked', vote)"
        type="button"
        data-model-toggle="voteEditModal"
        class="font-medium text-primary-600 hover:underline"
      >
        Edit
      </button>
      <button
        @click="$emit('viewClicked', vote)"
        type="button"
        data-model-toggle="voteViewModal"
        class="font-medium text-primary-600 hover:underline"
        v-if="vote.status !== STATUS.CREATED"
      >
        View
      </button>
    </td>
  </tr>
</template>
