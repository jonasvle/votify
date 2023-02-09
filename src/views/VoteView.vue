<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { useRoute } from "vue-router";
import { getOptions, getVote, submitOption } from "@/services/dbServices";
import {
  STATUS,
  TYPE,
  type Member,
  type Option,
  type Vote,
} from "@/common/interfaces";
import InlineErrorNotification from "@/components/InlineErrorNotification.vue";
import { onValue, ref as dbRef } from "@firebase/database";
import { database } from "@/configs/firebase";

const route = useRoute();

const dropdownInputRef: Ref<HTMLInputElement | null> = ref(null);
const dropdownButtonRef: Ref<HTMLButtonElement | null> = ref(null);
const showDropdown = ref(false);
const isLoading = ref(false);
const gettingData = ref(false);
const disableVote = ref(false);
const submitted = ref(false);
const error = ref("");
const options: Ref<Option[]> = ref([]);
const members: Ref<{ [key: string]: Member }> = ref({});
const vote: Ref<Vote | null> = ref(null);
const voter = ref("");
const radioOption = ref("");
const checkboxOptions: Ref<string[]> = ref([]);
const filteredMembers: Ref<Member[]> = ref([]);

const closeDropdown = (e: Event) => {
  if (
    !dropdownInputRef.value?.contains(e.target as HTMLElement) &&
    !dropdownButtonRef.value?.contains(e.target as HTMLElement)
  ) {
    showDropdown.value = false;
  }
};

const selectMember = (id: string, firstName: string, lastName: string) => {
  dropdownInputRef.value!.value = `${firstName} ${lastName}`;
  voter.value = id;
};

const onSubmit = async () => {
  isLoading.value = true;
  error.value = "";
  const options =
    vote.value?.type === TYPE.SINGLE
      ? [radioOption.value]
      : checkboxOptions.value;
  if (options.length > 0) {
    await getVote(route.params.voteId as string).then(async (v) => {
      if (v.status === STATUS.ACTIVE) {
        await submitOption(voter.value, vote.value?.id!, options)
          .then(() => {
            submitted.value = true;
          })
          .catch((e: Error) => {
            error.value = e.message;
          });
      } else {
        disableVote.value = true;
      }
    });
  } else {
    error.value = "Select at least one option.";
  }
  isLoading.value = false;
};

const updateFilter = () => {
  const membersArray = Object.keys(members.value).map(
    (key) => members.value[key]
  );

  filteredMembers.value = dropdownInputRef.value?.value
    ? membersArray.filter((member) => {
        const filterTerms = dropdownInputRef.value?.value.split(" ");
        return filterTerms?.every((term) => {
          return (
            member.firstName.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
            member.lastName.toLowerCase().indexOf(term.toLowerCase()) !== -1
          );
        });
      })
    : membersArray;
};

const setMember = () => {
  if (filteredMembers.value.length === 1) {
    selectMember(
      filteredMembers.value[0].id!,
      filteredMembers.value[0].firstName,
      filteredMembers.value[0].lastName
    );
  } else {
    dropdownInputRef.value!.value = "";
    updateFilter();
  }
};

onValue(dbRef(database, `votes/${route.params.voteId}`), async (snapshot) => {
  disableVote.value = false;
  gettingData.value = true;

  if (snapshot.exists()) {
    const snapshotVal = snapshot.val();
    vote.value = {
      id: route.params.voteId as string,
      name: snapshotVal.name,
      creationDate: snapshotVal.creationDate,
      status: snapshotVal.status as STATUS,
      type: snapshotVal.type as TYPE,
      options: snapshotVal.options,
      members: snapshotVal.members,
    };

    if (vote.value.status === STATUS.ACTIVE) {
      await getOptions(Object.keys(vote.value.options!)).then((o) => {
        options.value = o;
      });
      for (const memberId of Object.keys(vote.value.members!)) {
        onValue(dbRef(database, `members/${memberId}`), (snapshot) => {
          if (snapshot.exists()) {
            members.value[memberId] = {
              id: memberId,
              firstName: snapshot.val().firstName,
              lastName: snapshot.val().lastName,
            };
            if (snapshot.val().votedFor) {
              members.value[memberId].votedFor = Object.keys(
                snapshot.val().votedFor
              );
            }
            updateFilter();
          }
        });
      }
    } else {
      disableVote.value = true;
    }
    gettingData.value = false;
  }
});

onMounted(async () => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <div class="flex justify-center w-full p-6 bg-white">
    <div class="flex flex-col w-full h-full max-w-2xl">
      <h1 class="mb-6 text-3xl font-semibold text-gray-900">
        {{ vote?.name }}
      </h1>
      <p v-if="disableVote" class="text-lg font-light text-gray-500">
        This vote is closed
      </p>
      <p v-else-if="submitted" class="text-lg font-light text-gray-500">
        Your vote has been submitted
      </p>
      <div v-else-if="gettingData" role="status">
        <svg
          aria-hidden="true"
          class="w-8 h-8 mr-2 text-gray-200 animate-spin fill-primary-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
      <form
        v-else
        @submit.prevent="onSubmit"
        ref="formRef"
        class="flex flex-col flex-grow"
      >
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div
            v-for="option in options"
            :key="option.id"
            class="flex items-center pl-4 border border-gray-200 rounded"
          >
            <input
              v-if="vote?.type === TYPE.SINGLE"
              :id="option.id"
              :value="option.id"
              type="radio"
              name="vote"
              class="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
              required
              v-model="radioOption"
            />
            <input
              v-else
              :id="option.id"
              :value="option.id"
              type="checkbox"
              name="vote"
              class="w-4 h-4 bg-gray-100 border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
              v-model="checkboxOptions"
            />
            <label
              :for="option.id"
              class="w-full py-4 ml-2 text-sm font-medium text-gray-900"
              >{{ option.label }}</label
            >
          </div>
        </div>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              for="voter"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              Vote as
            </label>
            <div class="relative w-full">
              <input
                ref="dropdownInputRef"
                type="text"
                id="voter"
                name="voter"
                class="pr-9 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                placeholder="I will vote as"
                autocomplete="off"
                required
                @keyup="updateFilter"
                @focus="showDropdown = true"
                @blur="setMember"
              />
              <button
                ref="dropdownButtonRef"
                @click="showDropdown = !showDropdown"
                type="button"
                class="p-2.5 absolute top-0 right-0 text-sm font-medium text-gray-500"
              >
                <font-awesome-icon
                  class="w-5 h-5"
                  :icon="
                    showDropdown
                      ? 'fa-solid fa-chevron-up'
                      : 'fa-solid fa-chevron-down'
                  "
                />
              </button>

              <div
                class="absolute z-10 w-full overflow-auto translate-y-2 bg-white rounded shadow max-h-40"
                v-show="showDropdown"
              >
                <ul class="py-1 text-sm text-gray-700">
                  <li v-for="member in filteredMembers" :key="member.id">
                    <button
                      @click="
                        selectMember(
                          member.id!,
                          member.firstName,
                          member.lastName
                        )
                      "
                      type="button"
                      class="w-full px-4 py-2 text-left hover:bg-gray-100"
                      :disabled="member.votedFor?.includes(route.params.voteId as string)"
                    >
                      <div
                        v-if="member.votedFor?.includes(route.params.voteId as string)"
                        class="flex justify-between"
                      >
                        <span class="text-gray-400">
                          {{ member.firstName }} {{ member.lastName }}
                        </span>
                        <font-awesome-icon
                          class="w-4 h-4 text-green-500"
                          icon="fa-solid fa-check"
                        />
                      </div>
                      <div v-else>
                        <span>
                          {{ member.firstName }} {{ member.lastName }}
                        </span>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <InlineErrorNotification :error="error" />
        <button
          v-if="!isLoading"
          type="submit"
          class="mt-auto w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Submit
        </button>
        <button
          v-else
          disabled
          type="button"
          class="mt-auto w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <font-awesome-icon
            class="inline w-4 h-4 mr-3 text-white animate-spin"
            icon="fa-solid fa-spinner"
          />
          Loading...
        </button>
      </form>
    </div>
  </div>
</template>
