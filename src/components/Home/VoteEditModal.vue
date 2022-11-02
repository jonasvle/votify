<script setup lang="ts">
import { ref, type Ref } from "vue";

import InlineErrorNotification from "@/components/InlineErrorNotification.vue";
import { STATUS, TYPE, type Vote } from "@/common/interfaces";
import { getDateString } from "@/common/utils";
import { updateVote } from "@/services/dbServices";

const voteInFocus: Ref<Vote | null> = ref(null);
const showModal = ref(false);

const openModal = (vote: Vote) => {
  voteInFocus.value = vote;
  showModal.value = true;
};

const closeModal = () => {
  voteInFocus.value = null;
  isLoading.value = false;
  error.value = "";
  showModal.value = false;
};

const isLoading = ref(false);
const error = ref("");

const onSubmit = (event: Event) => {
  isLoading.value = true;
  const formData = new FormData(event.target as HTMLFormElement);

  const updatedVote: Vote = {
    id: voteInFocus.value?.id,
    name: formData.get("name") as string,
    creationDate: new Date(formData.get("creationDate") as string),
    status: formData.get("status") as STATUS,
    type: formData.get("type") as TYPE,
    options: voteInFocus.value?.options,
  };

  updateVote(updatedVote)
    .then(() => {
      closeModal();
    })
    .catch(() => {
      isLoading.value = false;
      error.value = "Failed to update the vote. Please try again later.";
    });
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<template>
  <div
    id="voteEditModal"
    tabindex="-1"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
    aria-modal
    role="dialog"
    v-show="showModal"
  >
    <div class="w-full h-full max-w-md p-4 m-auto">
      <div class="pb-6">
        <form @submit.prevent="onSubmit" class="bg-white rounded-lg shadow">
          <div class="flex items-start justify-between p-4 border-b rounded-t">
            <h3 class="text-xl font-semibold text-gray-900">Edit vote</h3>
            <button
              @click="closeModal"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              data-model-toggle="voteEditModal"
            >
              <font-awesome-icon class="w-5 h-5" icon="fa-solid fa-xmark" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                :value="voteInFocus?.name"
                required
              />
            </div>
            <div>
              <label
                for="creationDate"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Creation date
              </label>
              <input
                type="text"
                name="creationDate"
                id="creationDate"
                class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 cursor-not-allowed block w-full p-2.5"
                :value="getDateString(voteInFocus?.creationDate)"
                readonly
                required
              />
            </div>
            <div>
              <label
                for="status"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              >
                <option :selected="voteInFocus?.status === STATUS.CREATED">
                  {{ STATUS.CREATED }}
                </option>
                <option :selected="voteInFocus?.status === STATUS.ACTIVE">
                  {{ STATUS.ACTIVE }}
                </option>
                <option :selected="voteInFocus?.status === STATUS.CLOSED">
                  {{ STATUS.CLOSED }}
                </option>
              </select>
            </div>
            <div>
              <label
                for="type"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Type
              </label>
              <select
                name="type"
                id="type"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              >
                <option :selected="voteInFocus?.type === TYPE.SINGLE">
                  {{ TYPE.SINGLE }}
                </option>
                <option :selected="voteInFocus?.type === TYPE.MULTI">
                  {{ TYPE.MULTI }}
                </option>
              </select>
            </div>
          </div>
          <div class="p-6 space-y-4 border-t border-gray-200">
            <InlineErrorNotification :error="error" />
            <div class="flex items-center space-x-2 rounded-b">
              <button
                v-if="!isLoading"
                type="submit"
                class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Update all
              </button>
              <button
                v-else
                disabled
                type="button"
                class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
              >
                <font-awesome-icon
                  class="inline w-4 h-4 mr-3 text-white animate-spin"
                  icon="fa-solid fa-spinner"
                />
                Loading...
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
