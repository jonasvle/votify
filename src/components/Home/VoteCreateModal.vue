<script setup lang="ts">
import { ref, type Ref } from "vue";

import InlineErrorNotification from "@/components/InlineErrorNotification.vue";
import { STATUS, TYPE, type Vote } from "@/common/interfaces";
import { getDateString } from "@/common/utils";
import { createVote } from "@/services/dbServices";

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  isLoading.value = false;
  error.value = "";
  formRef.value!.reset();
  showModal.value = false;
};

const nrOfOptions = ref(2);

const isLoading = ref(false);
const error = ref("");
const formRef: Ref<HTMLFormElement | null> = ref(null);

const onSubmit = () => {
  isLoading.value = true;
  const formData = new FormData(formRef.value!);
  const options: string[] = [];
  for (let [key, value] of formData.entries()) {
    if ((key as string).startsWith("option")) {
      options.push(value as string);
    }
  }

  const newVote: Vote = {
    name: formData.get("name") as string,
    creationDate: new Date(),
    status: formData.get("status") as STATUS,
    type: formData.get("type") as TYPE,
    options: options,
  };

  createVote(newVote)
    .then(() => {
      closeModal();
    })
    .catch(() => {
      isLoading.value = false;
      error.value = "Failed to create a new vote. Please try again later.";
    });
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<template>
  <div
    id="voteCreateModal"
    tabindex="-1"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center block w-full h-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
    aria-modal
    role="dialog"
    v-show="showModal"
  >
    <div class="w-full h-full max-w-2xl p-4 m-auto">
      <div class="pb-6">
        <form
          ref="formRef"
          @submit.prevent="onSubmit"
          class="bg-white rounded-lg shadow"
        >
          <div class="flex items-start justify-between p-4 border-b rounded-t">
            <h3 class="text-xl font-semibold text-gray-900">Create vote</h3>
            <button
              @click="closeModal"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              data-model-toggle="voteCreateModal"
            >
              <font-awesome-icon class="w-5 h-5" icon="fa-solid fa-xmark" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-6 gap-4">
              <div class="col-span-6 sm:col-span-3">
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
                  required
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
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
                  :value="getDateString(new Date())"
                  disabled
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
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
                  <option selected>
                    {{ STATUS.CREATED }}
                  </option>
                  <option>
                    {{ STATUS.ACTIVE }}
                  </option>
                  <option>
                    {{ STATUS.CLOSED }}
                  </option>
                </select>
              </div>
              <div class="col-span-6 sm:col-span-3">
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
                  <option selected>Single select</option>
                  <option>Multi select</option>
                </select>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-4 border-t border-gray-200">
            <p>Options</p>
            <div class="grid grid-cols-6 gap-4">
              <div
                v-for="n in nrOfOptions"
                :key="n"
                class="col-span-6 sm:col-span-3"
              >
                <label
                  :for="`option${n}`"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Option {{ n }}
                </label>
                <input
                  type="text"
                  :name="`option${n}`"
                  :id="`option${n}`"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Label"
                  required
                />
              </div>
            </div>
            <button
              type="button"
              class="px-3 py-2 mr-2 text-xs font-medium text-center border rounded-lg text-primary-700 hover:text-white border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300"
              @click="nrOfOptions++"
            >
              + Add option
            </button>
            <button
              v-if="nrOfOptions > 2"
              type="button"
              class="px-3 py-2 text-xs font-medium text-center text-red-700 border border-red-700 rounded-lg hover:text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
              @click="nrOfOptions--"
            >
              - Remove option
            </button>
          </div>
          <div class="p-6 space-y-4 border-t border-gray-200">
            <InlineErrorNotification :error="error" />
            <div class="flex items-center space-x-2 rounded-b">
              <button
                v-if="!isLoading"
                type="submit"
                class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Create
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
