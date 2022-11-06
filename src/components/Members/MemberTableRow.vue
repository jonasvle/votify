<script setup lang="ts">
import type { PropType } from "vue";

import type { Member } from "@/common/interfaces";

const props = defineProps({
  checked: {
    type: Boolean,
  },
  member: {
    type: Object as PropType<Member>,
    required: true,
  },
});

const emit = defineEmits(["checkedChanged"]);

const checkedChanged = (event: Event) => {
  emit(
    "checkedChanged",
    props.member.id,
    (event.target as HTMLInputElement).checked
  );
};
</script>

<template>
  <tr class="bg-white border-b hover:bg-gray-50">
    <td class="w-4 p-4">
      <div class="flex items-center">
        <input
          type="checkbox"
          class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2"
          :checked="checked"
          @click="checkedChanged"
        />
      </div>
    </td>
    <td class="px-6 py-4">{{ member.firstName }}</td>
    <td class="px-6 py-4">{{ member.lastName }}</td>
  </tr>
</template>
