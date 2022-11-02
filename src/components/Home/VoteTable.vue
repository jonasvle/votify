<script setup lang="ts">
import { computed, ref } from "vue";
import type { Ref } from "vue";
import { onValue, ref as dbRef } from "@firebase/database";

import DropdownButton from "@/components/DropdownButton.vue";
import DropdownButtonItem from "@/components/DropdownButtonItem.vue";
import Search from "@/components/Search.vue";
import VoteTableRow from "@/components/Home/VoteTableRow.vue";
import VoteEditModal from "@/components/Home/VoteEditModal.vue";
import type { STATUS, TYPE, Vote } from "@/common/interfaces";
import { database } from "@/configs/firebase";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const votes: Ref<Vote[]> = ref([]);

onValue(dbRef(database, `users/${authStore.user!.uid}/votes`), (snapshot) => {
  if (snapshot.size > 0) {
    const voteIds = Object.keys(snapshot.val());
    const snapshotVotes: Vote[] = [];
    for (const i in voteIds) {
      onValue(dbRef(database, `votes/${voteIds[i]}`), (snapshot) => {
        const data = snapshot.val();
        const vote: Vote = {
          name: data.name,
          creationDate: new Date(data.creationDate),
          status: data.status as STATUS,
          type: data.type as TYPE,
        };
        snapshotVotes.push(vote);
        if (parseInt(i, 10) >= voteIds.length - 1) {
          votes.value = snapshotVotes;
        }
      });
    }
  }
});

const searchBy = ref("");

const searchTable = (searchValue: string) => {
  searchBy.value = searchValue;
};

const currentSort = ref("creationDate");
const currentSortDir = ref(-1); // -1 = descending ; 1 = ascending

const sortedVotes = computed(() => {
  const filteredVotes = searchBy.value
    ? votes.value.filter((vote) => {
        return (
          vote.name.toLowerCase().indexOf(searchBy.value.toLowerCase()) != -1
        );
      })
    : votes.value;
  return filteredVotes.sort((voteA, voteB) => {
    const key = currentSort.value as keyof Vote;
    if (currentSort.value === "creationDate") {
      return (
        ((voteA[key] as Date).getTime() - (voteB[key] as Date).getTime()) *
        currentSortDir.value
      );
    } else {
      return (
        (voteA[key] as string).localeCompare(voteB[key] as string) *
        currentSortDir.value
      );
    }
  });
});

const sort = (column: string) => {
  if (column === currentSort.value) {
    currentSortDir.value = -currentSortDir.value;
  } else {
    currentSortDir.value = 1;
  }
  currentSort.value = column;
};

const getSortIcon = (column: string) => {
  if (column === currentSort.value) {
    return currentSortDir.value < 0
      ? "fa-solid fa-sort-down"
      : "fa-solid fa-sort-up";
  } else {
    return "fa-solid fa-sort";
  }
};

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
        <Search placeholder="Search for votes" @value-changed="searchTable" />
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
                <button @click="sort('name')">
                  <font-awesome-icon
                    class="w-3 h-3 ml-1"
                    :icon="getSortIcon('name')"
                  />
                </button>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center">
                Creation date
                <button @click="sort('creationDate')">
                  <font-awesome-icon
                    class="w-3 h-3 ml-1"
                    :icon="getSortIcon('creationDate')"
                  />
                </button>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center">
                Status
                <button @click="sort('status')">
                  <font-awesome-icon
                    class="w-3 h-3 ml-1"
                    :icon="getSortIcon('status')"
                  />
                </button>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <VoteTableRow
            v-for="vote in sortedVotes"
            :key="vote.creationDate.getTime()"
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
