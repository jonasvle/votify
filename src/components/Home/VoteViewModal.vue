<script setup lang="ts">
import { ref, type Ref } from "vue";
import { ref as dbRef } from "@firebase/database";
import QrcodeVue from "qrcode.vue";

import type { Vote } from "@/common/interfaces";
import { onValue } from "@firebase/database";
import { database } from "@/configs/firebase";

const voteInFocus: Ref<Vote | null> = ref(null);
const showModal = ref(false);
const voteUrl = ref("");
const totalNrOfVotes = ref(0);

const openModal = (vote: Vote) => {
  voteInFocus.value = vote;
  voteUrl.value = `${window.location.origin}/vote/${voteInFocus.value?.id}`;
  onValue(
    dbRef(database, `votes/${voteInFocus.value?.id}/totalNrOfVotes`),
    (snapshot) => {
      if (snapshot.exists()) {
        totalNrOfVotes.value = snapshot.val() as number;
      }
    }
  );
  showModal.value = true;
};

const closeModal = () => {
  voteInFocus.value = null;
  voteUrl.value = "";
  totalNrOfVotes.value = 0;
  showModal.value = false;
};

defineExpose({
  openModal,
  closeModal,
});
</script>

<template>
  <div
    id="voteViewModal"
    tabindex="-1"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full p-4 overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50"
    aria-modal
    role="dialog"
    v-show="showModal"
  >
    <div class="w-full h-full max-w-md p-4 m-auto">
      <div class="pb-6">
        <div class="bg-white rounded-lg shadow">
          <div class="flex items-start justify-between p-4 border-b rounded-t">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ voteInFocus?.name }}
            </h3>
            <button
              @click="closeModal"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <font-awesome-icon class="w-5 h-5" icon="fa-solid fa-xmark" />
            </button>
          </div>
          <div class="flex flex-col items-center gap-6 p-6">
            <qrcode-vue
              :size="300"
              render-as="canvas"
              level="L"
              :value="voteUrl"
            />
            <p class="text-lg font-light text-gray-500">
              People voted: {{ totalNrOfVotes }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
