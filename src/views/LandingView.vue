<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useRouter } from "vue-router";

import InlineErrorNotification from "@/components/InlineErrorNotification.vue";
import { getVoteId } from "@/services/dbServices";

const errorRef = ref("");
const sequenceRef: Ref<number | null> = ref(null);

const router = useRouter();

const openVote = async () => {
  if (sequenceRef.value?.toString().length === 6) {
    const voteId = await getVoteId(Number(sequenceRef.value));
    if (voteId) {
      router.push({ name: "vote", params: { voteId: voteId } });
    } else {
      errorRef.value = "No vote vote was found with this code";
    }
  } else {
    errorRef.value = "Please enter a 6 digit code";
  }
};
</script>

<template>
  <div class="flex flex-col h-screen">
    <div
      class="flex flex-col items-center justify-center flex-grow px-6 py-8 mx-auto lg:py-0"
    >
      <img class="mb-6 w-72" src="@/assets/logo.svg" alt="Votify" />
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <InlineErrorNotification class="mb-4" :error="errorRef" />
          <form class="space-y-4 md:space-y-6" @submit.prevent="openVote">
            <div>
              <label
                for="voteSequence"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Vote code
              </label>
              <input
                type="number"
                name="voteSequence"
                id="voteSequence"
                class="block w-full p-4 text-lg font-extrabold text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-3xl focus:ring-primary-600 focus:border-primary-600"
                placeholder="123456"
                required
                v-model="sequenceRef"
              />
            </div>
            <button
              type="submit"
              class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
    <Adsense
      class="h-16"
      data-ad-client="ca-pub-9268131795554908"
      data-ad-slot="1937626951"
      data-full-width-responsive="true"
    ></Adsense>
  </div>
</template>
