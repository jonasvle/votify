<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import DropdownButton from "@/components/DropdownButton.vue";
import DropdownButtonItem from "./DropdownButtonItem.vue";
import VoteEditModal from "@/components/VoteEditModal.vue";

const voteEditModalRef: Ref<typeof VoteEditModal | null> = ref(null);

const openVoteEditModal = () => {
  voteEditModalRef.value?.openModal();
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between py-4">
      <DropdownButton>
        <DropdownButtonItem>Activate</DropdownButtonItem>
        <DropdownButtonItem>Close</DropdownButtonItem>
        <hr class="my-1 border-gray-100" />
        <DropdownButtonItem important>Delete</DropdownButtonItem>
      </DropdownButton>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
        >
          <font-awesome-icon
            class="w-5 h-5 text-gray-500"
            icon="fa-solid fa-search"
          />
        </div>
        <input
          type="search"
          class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 focus:ring-primary-500 focus:border-primary-500 focus-visible:outline-none"
          placeholder="Search for votes"
        />
      </div>
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-white uppercase bg-primary-700">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2"
                />
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center">
                Name
                <button>
                  <font-awesome-icon
                    class="w-3 h-3 ml-1"
                    icon="fa-solid fa-sort"
                  />
                </button>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center">
                Creation date
                <button>
                  <font-awesome-icon
                    class="w-3 h-3 ml-1"
                    icon="fa-solid fa-sort-down"
                  />
                </button>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center">
                Status
                <button>
                  <font-awesome-icon
                    class="w-3 h-3 ml-1"
                    icon="fa-solid fa-sort-up"
                  />
                </button>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2"
                />
              </div>
            </td>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              Cooptation Patrick
            </th>
            <td class="px-6 py-4">29/10/2022</td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                Active
              </div>
            </td>
            <td class="flex items-center px-6 py-4 space-x-3">
              <button
                @click="openVoteEditModal"
                type="button"
                data-model-toggle="voteEditModal"
                class="font-medium text-primary-600 hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                data-model-toggle="voteViewModal"
                class="font-medium text-primary-600 hover:underline"
              >
                View
              </button>
            </td>
          </tr>
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2"
                />
              </div>
            </td>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              Resignation Patrick
            </th>
            <td class="px-6 py-4">29/10/2022</td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-2.5 w-2.5 rounded-full bg-gray-400 mr-2"></div>
                Created
              </div>
            </td>
            <td class="flex items-center px-6 py-4 space-x-3">
              <button
                @click="openVoteEditModal"
                type="button"
                data-model-toggle="voteEditModal"
                class="font-medium text-primary-600 hover:underline"
              >
                Edit
              </button>
            </td>
          </tr>
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2"
                />
              </div>
            </td>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              Approval Changes IR
            </th>
            <td class="px-6 py-4">28/10/2022</td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="h-2.5 w-2.5 rounded-full bg-red-400 mr-2"></div>
                Closed
              </div>
            </td>
            <td class="flex items-center px-6 py-4 space-x-3">
              <button
                @click="openVoteEditModal"
                type="button"
                data-model-toggle="voteEditModal"
                class="font-medium text-primary-600 hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                data-model-toggle="voteViewModal"
                class="font-medium text-primary-600 hover:underline"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <VoteEditModal ref="voteEditModalRef" />
  </div>
</template>
