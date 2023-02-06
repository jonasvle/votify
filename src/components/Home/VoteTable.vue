<script setup lang="ts">
import { computed, ref } from "vue";
import type { Ref } from "vue";
import { onValue, ref as dbRef } from "@firebase/database";

import DropdownButton from "@/components/DropdownButton.vue";
import DropdownButtonItem from "@/components/DropdownButtonItem.vue";
import Search from "@/components/Search.vue";
import VoteTableRow from "@/components/Home/VoteTableRow.vue";
import VoteEditModal from "@/components/Home/VoteEditModal.vue";
import VoteViewModal from "@/components/Home/VoteViewModal.vue";
import PopupModal from "@/components/PopupModal.vue";
import { STATUS, type TYPE, type Vote } from "@/common/interfaces";
import { database } from "@/configs/firebase";
import { useAuthStore } from "@/stores/auth";
import { setStatus, deleteVote } from "@/services/dbServices";

const authStore = useAuthStore();

const votes: Ref<{ [key: string]: Vote }> = ref({});

onValue(dbRef(database, `users/${authStore.user!.uid}/votes`), (snapshot) => {
  if (snapshot.size > 0) {
    const voteIds = Object.keys(snapshot.val());
    for (const i in voteIds) {
      onValue(dbRef(database, `votes/${voteIds[i]}`), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const vote: Vote = {
            id: voteIds[i],
            name: data.name,
            creationDate: new Date(data.creationDate),
            status: data.status as STATUS,
            type: data.type as TYPE,
            selected: false,
          };
          votes.value[voteIds[i]] = vote;
        } else {
          delete votes.value[voteIds[i]];
        }
      });
    }
  }
});

const searchBy = ref("");

const searchTable = (searchValue: string) => {
  searchBy.value = searchValue.trim();
};

const currentSort = ref("creationDate");
const currentSortDir = ref(-1); // -1 = descending ; 1 = ascending

const sortedVotes = computed(() => {
  const votesArray = Object.keys(votes.value).map((key) => votes.value[key]);

  const filteredVotes = searchBy.value
    ? votesArray.filter((vote) => {
        return (
          vote.name.toLowerCase().indexOf(searchBy.value.toLowerCase()) !== -1
        );
      })
    : votesArray;
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

const voteViewModalRef: Ref<typeof VoteViewModal | null> = ref(null);

const openVoteViewModal = (vote: Vote) => {
  voteViewModalRef.value?.openModal(vote);
};

const selectAllRef = ref(null);

const updateSelected = (voteId: string, newStatus: boolean) => {
  votes.value[voteId].selected = newStatus;
  const headerCheckbox = selectAllRef.value! as HTMLInputElement;

  if (selectedVotes.value.length > 0) {
    if (Object.keys(votes.value).length === selectedVotes.value.length) {
      headerCheckbox.checked = true;
      headerCheckbox.indeterminate = false;
    } else {
      headerCheckbox.checked = true;
      headerCheckbox.indeterminate = true;
    }
  } else {
    headerCheckbox.checked = false;
    headerCheckbox.indeterminate = false;
  }
};

const selectAllClicked = (event: Event) => {
  selectAll((event.target as HTMLInputElement).checked);
};

const selectAll = (isSelected: boolean) => {
  Object.keys(votes.value).forEach(
    (id) => (votes.value[id].selected = isSelected)
  );
  const headerCheckbox = selectAllRef.value! as HTMLInputElement;
  headerCheckbox.checked = isSelected;
  headerCheckbox.indeterminate = false;
};

const selectedVotes = computed(() => {
  const selectedVotes: string[] = [];
  for (const id in votes.value) {
    if (votes.value[id].selected === true) {
      selectedVotes.push(id);
    }
  }
  return selectedVotes;
});

const activateClicked = () => {
  selectedVotes.value.forEach((voteId) => {
    setStatus(voteId, STATUS.ACTIVE).then(() => {
      selectAll(false);
    });
  });
};

const closeClicked = () => {
  selectedVotes.value.forEach((voteId) => {
    setStatus(voteId, STATUS.CLOSED).then(() => {
      selectAll(false);
    });
  });
};

const popupModalRef: Ref<typeof PopupModal | null> = ref(null);
const deleteClicked = () => {
  popupModalRef.value!.openModal();
};
const deleteVotes = () => {
  if (selectedVotes.value.length < 1) {
    popupModalRef.value!.closeModal();
    selectAll(false);
  }
  selectedVotes.value.forEach((voteId) => {
    deleteVote(voteId).then(() => {
      popupModalRef.value!.closeModal();
      selectAll(false);
    });
  });
};

const activateVote = (vote: Vote) => {
  setStatus(vote.id!, STATUS.ACTIVE);
};

const closeVote = (vote: Vote) => {
  setStatus(vote.id!, STATUS.CLOSED);
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between py-4">
      <DropdownButton>
        <DropdownButtonItem @on-clicked="activateClicked">
          Activate
        </DropdownButtonItem>
        <DropdownButtonItem @on-clicked="closeClicked">
          Close
        </DropdownButtonItem>
        <hr class="my-1 border-gray-100" />
        <DropdownButtonItem @on-clicked="deleteClicked" important>
          Delete
        </DropdownButtonItem>
      </DropdownButton>
      <Search placeholder="Search for votes" @value-changed="searchTable" />
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-white uppercase bg-primary-700">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  ref="selectAllRef"
                  type="checkbox"
                  class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2"
                  @click="selectAllClicked"
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
            :key="vote.id"
            :vote="vote"
            :checked="vote.selected"
            @checked-changed="updateSelected"
            @edit-clicked="openVoteEditModal"
            @view-clicked="openVoteViewModal"
            @activate-clicked="activateVote"
            @close-clicked="closeVote"
          />
        </tbody>
      </table>
      <div
        v-if="sortedVotes.length < 1"
        class="flex items-center justify-center"
      >
        <p class="m-4 text-gray-500">No votes available</p>
      </div>
    </div>
    <VoteEditModal ref="voteEditModalRef" />
    <VoteViewModal ref="voteViewModalRef" />
    <PopupModal
      ref="popupModalRef"
      message="Are you sure you want to delete the selected votes?"
      confirm="Delete"
      cancel="Cancel"
      @submit="deleteVotes"
    />
  </div>
</template>
