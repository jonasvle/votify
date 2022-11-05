<script setup lang="ts">
import { ref, type Ref } from "vue";

import InlineErrorNotification from "@/components/InlineErrorNotification.vue";
import type { Member } from "@/common/interfaces";
import { createMember } from "@/services/dbServices";

const showModal = ref(false);
const isLoading = ref(false);
const error = ref("");
const formRef: Ref<HTMLFormElement | null> = ref(null);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  isLoading.value = false;
  error.value = "";
  formRef.value!.reset();
  showModal.value = false;
};

const onSubmit = () => {
  isLoading.value = true;
  const formData = new FormData(formRef.value!);

  const newMember: Member = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
  };

  createMember(newMember)
    .then(() => {
      closeModal();
    })
    .catch(() => {
      isLoading.value = false;
      error.value = "Failed to create a new member. Please try again later.";
    });
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<template>
  <div
    id="memberCreateModal"
    tabindex="-1"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
    aria-modal
    role="dialog"
    v-show="showModal"
  >
    <div class="flex flex-col justify-center w-full h-full max-w-md p-4 m-auto">
      <div class="pb-6">
        <form
          ref="formRef"
          @submit.prevent="onSubmit"
          class="bg-white rounded-lg shadow"
        >
          <div class="flex items-start justify-between p-4 border-b rounded-t">
            <h3 class="text-xl font-semibold text-gray-900">Create member</h3>
            <button
              @click="closeModal"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <font-awesome-icon class="w-5 h-5" icon="fa-solid fa-xmark" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label
                for="firstName"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                First name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
            <div>
              <label
                for="lastName"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
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
