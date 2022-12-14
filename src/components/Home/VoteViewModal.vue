<script setup lang="ts">
import { ref, type Ref } from "vue";
import { onValue, ref as dbRef } from "@firebase/database";
import QrcodeVue from "qrcode.vue";

import BarChart from "@/components/BarChart.vue";
import { STATUS, type Option, type Vote } from "@/common/interfaces";
import { database } from "@/configs/firebase";
import { getOptions, getVoteOptions } from "@/services/dbServices";

const voteInFocus: Ref<Vote | null> = ref(null);
const showModal = ref(false);
const voteUrl = ref("");
const totalNrOfVotes = ref(0);
const chartData = ref({
  labels: [] as string[],
  data: [] as number[],
});

const openModal = async (vote: Vote) => {
  voteInFocus.value = vote;
  if (voteInFocus.value.status === STATUS.ACTIVE) {
    voteUrl.value = `${window.location.origin}/vote/${voteInFocus.value?.id}`;
    onValue(
      dbRef(database, `votes/${voteInFocus.value?.id}/totalNrOfVotes`),
      (snapshot) => {
        if (snapshot.exists()) {
          totalNrOfVotes.value = snapshot.val() as number;
        }
      }
    );
  } else if (voteInFocus.value.status === STATUS.CLOSED) {
    const options = await getOptions(
      await getVoteOptions(voteInFocus.value.id!)
    );
    chartData.value = {
      labels: options.map((option) => option.label),
      data: options.map((option) => option.nrOfVotes!),
    };
  }

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
          <div
            v-if="voteInFocus?.status === STATUS.ACTIVE"
            class="flex flex-col items-center gap-6 p-6"
          >
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
          <div v-else class="flex flex-col items-center gap-6 p-6">
            <BarChart :data="chartData" />
            <!-- <p
              v-for="option in options"
              :key="option.id"
              class="text-lg font-light text-gray-500"
            >
              {{ option.label }}: {{ option.nrOfVotes }}
            </p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
