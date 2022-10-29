<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";

import DropdownButton from "@/components/DropdownButton.vue";
import DropdownButtonItem from "@/components/DropdownButtonItem.vue";
import Search from "@/components/Search.vue";
import VoteTableRow from "@/components/VoteTable/VoteTableRow.vue";
import VoteEditModal from "@/components/VoteTable/VoteEditModal.vue";
import { STATUS, type Vote } from "@/common/interfaces";

const votes: Vote[] = [
  {
    name: "Vote 3",
    creationDate: new Date(2022, 9, 29),
    status: STATUS.CREATED,
  },
  {
    name: "Vote 2",
    creationDate: new Date(2022, 9, 28),
    status: STATUS.ACTIVE,
  },
  {
    name: "Vote 1",
    creationDate: new Date(2022, 9, 27),
    status: STATUS.CLOSED,
  },
];

const voteEditModalRef: Ref<typeof VoteEditModal | null> = ref(null);

const openVoteEditModal = (vote: Vote) => {
  voteEditModalRef.value?.openModal(vote);
};

const openVoteViewModal = () => {
  console.log("opening view modal...");
};

const updateChecked = (newStatus: boolean) => {
  console.log(newStatus);
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
        <Search placeholder="Search for votes" />
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
          <VoteTableRow
            v-for="vote in votes"
            :key="vote.name"
            :vote="vote"
            @checked-changed="updateChecked"
            @edit-clicked="openVoteEditModal"
            @view-clicked="openVoteViewModal"
          />
        </tbody>
      </table>
    </div>
    <VoteEditModal ref="voteEditModalRef" />
  </div>
</template>
