<script setup lang="ts">
import { computed, ref } from "vue";
import type { Ref } from "vue";
import { onValue, ref as dbRef } from "@firebase/database";

import DropdownButton from "@/components/DropdownButton.vue";
import DropdownButtonItem from "../DropdownButtonItem.vue";
import Search from "@/components/Search.vue";
import MemberTableRow from "@/components/Members/MemberTableRow.vue";
import PopupModal from "../PopupModal.vue";
import type { Member } from "@/common/interfaces";
import { database } from "@/configs/firebase";
import { useAuthStore } from "@/stores/auth";
import { deleteMember } from "@/services/dbServices";
import VoteCreateModal from "../Home/VoteCreateModal.vue";

const authStore = useAuthStore();

const members: Ref<{ [key: string]: Member }> = ref({});

onValue(dbRef(database, `users/${authStore.user!.uid}/members`), (snapshot) => {
  if (snapshot.size > 0) {
    const memberIds = Object.keys(snapshot.val());
    for (const i in memberIds) {
      onValue(dbRef(database, `members/${memberIds[i]}`), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const member: Member = {
            id: memberIds[i],
            firstName: data.firstName,
            lastName: data.lastName,
            selected: false,
          };
          members.value[memberIds[i]] = member;
        } else {
          delete members.value[memberIds[i]];
        }
      });
    }
  }
});

const searchBy = ref("");

const searchTable = (searchValue: string) => {
  searchBy.value = searchValue;
};

const currentSort = ref("lastName");
const currentSortDir = ref(1); // -1 = descending ; 1 = ascending

const sortedMembers = computed(() => {
  const membersArray = Object.keys(members.value).map(
    (key) => members.value[key]
  );

  // TODO should be able to search on full name as well
  const filteredMembers = searchBy.value
    ? membersArray.filter((member) => {
        return (
          member.firstName
            .toLowerCase()
            .indexOf(searchBy.value.toLowerCase()) !== -1 ||
          member.lastName
            .toLowerCase()
            .indexOf(searchBy.value.toLowerCase()) !== -1
        );
      })
    : membersArray;

  return filteredMembers.sort((memberA, memberB) => {
    const key = currentSort.value as keyof Member;
    return (
      (memberA[key] as string).localeCompare(memberB[key] as string) *
      currentSortDir.value
    );
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

const selectAllRef = ref(null);

const selectedMembers = computed(() => {
  const selectedMembers: string[] = [];
  for (const id in members.value) {
    if (members.value[id].selected === true) {
      selectedMembers.push(id);
    }
  }
  return selectedMembers;
});

const updateSelected = (memberId: string, newStatus: boolean) => {
  members.value[memberId].selected = newStatus;
  const headerCheckbox = selectAllRef.value! as HTMLInputElement;

  if (selectedMembers.value.length > 0) {
    if (Object.keys(members.value).length === selectedMembers.value.length) {
      headerCheckbox.checked = true;
      headerCheckbox.indeterminate = false;
    } else {
      headerCheckbox.checked = true;
      headerCheckbox.indeterminate = false;
    }
  } else {
    headerCheckbox.checked = false;
    headerCheckbox.indeterminate = false;
  }
};

const selectAll = (isSelected: boolean) => {
  Object.keys(members.value).forEach((id) => {
    members.value[id].selected = isSelected;
  });
  const headerCheckbox = selectAllRef.value! as HTMLInputElement;
  headerCheckbox.checked = isSelected;
  headerCheckbox.indeterminate = false;
};

const selectAllClicked = (event: Event) => {
  selectAll((event.target as HTMLInputElement).checked);
};

const popupModalRef: Ref<typeof PopupModal | null> = ref(null);
const deleteClicked = () => {
  popupModalRef.value!.openModal();
};
const deleteMembers = () => {
  if (selectedMembers.value.length < 1) {
    popupModalRef.value!.closeModal();
    selectAll(false);
  }
  selectedMembers.value.forEach((memberId) => {
    deleteMember(memberId).then(() => {
      popupModalRef.value!.closeModal();
      selectAll(false);
    });
  });
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between py-4">
      <DropdownButton>
        <DropdownButtonItem @on-clicked="deleteClicked" important
          >Delete</DropdownButtonItem
        >
      </DropdownButton>
      <Search placeholder="Search for members" @value-changed="searchTable" />
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
                First name
                <button @click="sort('firstName')">
                  <font-awesome-icon
                    class="w-3 h-3 ml-1"
                    :icon="getSortIcon('firstName')"
                  />
                </button>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              <div class="flex items-center">
                Last name
                <button @click="sort('lastName')">
                  <font-awesome-icon
                    class="w-3 h-3 ml-1"
                    :icon="getSortIcon('lastName')"
                  />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <MemberTableRow
            v-for="member in sortedMembers"
            :key="member.id"
            :member="member"
            :checked="member.selected"
            @checked-changed="updateSelected"
          />
        </tbody>
      </table>
      <div
        v-if="sortedMembers.length < 1"
        class="flex items-center justify-center"
      >
        <p class="m-4 text-gray-500">No members available</p>
      </div>
      <PopupModal
        ref="popupModalRef"
        message="Are you sure you want to delete the selected members?"
        confirm="Delete"
        cancel="Cancel"
        @submit="deleteMembers"
      />
    </div>
  </div>
</template>
