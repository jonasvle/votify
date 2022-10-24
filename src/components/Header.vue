<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const searchRef = ref();
let inputValue = ref("");

onMounted(() => {
  document.addEventListener("keydown", searchShortcut);
});

onUnmounted(() => {
  document.removeEventListener("keydown", searchShortcut);
});

const searchShortcut = (e: KeyboardEvent) => {
  if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    searchRef.value.focus();
  }
};

const onSubmit = () => {
  console.log("submitted", inputValue.value);
};

const onLogoutClicked = () => {
  router.replace({ name: "login" });
};
</script>

<template>
  <header class="z-10 py-4 bg-white border-b border-gray-200">
    <div
      class="flex items-center justify-between px-6 mx-auto text-primary-600"
    >
      <form class="w-full max-w-xl mr-6" @submit.prevent="onSubmit">
        <div class="relative">
          <div
            class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
          >
            <font-awesome-icon
              class="w-4 h-4"
              icon="fa-solid fa-magnifying-glass"
            />
          </div>
          <input
            ref="searchRef"
            type="search"
            class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 focus-visible:outline-none"
            placeholder="Search for votes"
            aria-label="Search for votes"
            v-model="inputValue"
          />
        </div>
      </form>
      <!-- <div class="flex flex-1 lg:mr-32">
        <div class="relative w-full max-w-xl mr-6">
          <div class="absolute inset-y-0 flex items-center pl-2">
            <font-awesome-icon
              class="w-4 h-4"
              icon="fa-solid fa-magnifying-glass"
            />
          </div>
          <form class="w-full" @submit.prevent="onSubmit">
            <input
              ref="searchRef"
              type="search"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Search for votes"
              aria-label="Search for votes"
              v-model="inputValue"
            />
          </form>
        </div>
      </div> -->
      <ul class="flex items-center flex-shrink-0 space-x-6">
        <li class="flex">
          <button
            class="rounded-md focus:outline-none focus:shadow-outline-purple"
            @click="onLogoutClicked"
          >
            <font-awesome-icon
              class="w-5 h-5"
              icon="fa-solid fa-arrow-right-from-bracket"
            />
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>
