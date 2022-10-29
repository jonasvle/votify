<script setup lang="ts">
import { ref, type Ref } from "vue";

import { STATUS, type Vote } from "@/common/interfaces";
import { getDateString } from "@/common/utils";

const voteInFocus: Ref<Vote | null> = ref(null);
const showModal = ref(false);

const openModal = (vote: Vote) => {
  voteInFocus.value = vote;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
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
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50 md:inset-0 h-modal md:h-full"
    aria-modal
    role="dialog"
    v-show="showModal"
  >
    <div class="relative w-full h-full max-w-md p-4 md:h-auto">
      <div class="relative bg-white rounded-lg shadow">
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
        <div class="p-6 lg:px-8">
          <form class="space-y-4">
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
                disabled
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
          </form>
        </div>
        <div
          class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b"
        >
          <button
            type="submit"
            class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Save all
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
