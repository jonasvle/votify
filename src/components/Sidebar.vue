<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import placeholder from "../assets/avatar.jpg";

const router = useRouter();
const authStore = useAuthStore();

defineProps({
  show: Boolean,
});

const pages = [
  {
    name: "Votes",
    icon: "fa-solid fa-check-to-slot",
    to: "/home",
  },
  {
    name: "Members",
    icon: "fa-solid fa-users",
    to: "/members",
  },
];

const onLogoutClicked = async () => {
  await authStore.logout();
  router.replace({ name: "login" });
};

const getProfileUrl = () => {
  return authStore.user?.photoURL
    ? new URL(authStore.user.photoURL as string).href
    : placeholder;
};
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 z-40 h-full bg-black bg-opacity-50 lg:hidden"
  ></div>
  <aside
    class="fixed top-0 left-0 z-50 flex h-full lg:block"
    aria-label="Sidebar"
  >
    <div
      class="w-64 h-full px-3 py-5 overflow-y-auto bg-white border-r border-gray-200"
    >
      <div class="flex content-center mb-5">
        <router-link
          @click="$emit('closeSidebar')"
          class="flex pl-2"
          to="/home"
        >
          <img class="w-28" src="@/assets/logo.svg" alt="Votify" />
        </router-link>
        <button
          @click="$emit('closeSidebar')"
          type="button"
          class="lg:hidden text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        >
          <font-awesome-icon class="w-5 h-5" icon="fa-solid fa-xmark" />
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <div class="pb-5 mb-5 text-center text-gray-500 border-b border-gray-200">
        <img
          class="w-20 h-20 m-auto mb-4 rounded-full"
          :src="getProfileUrl()"
          alt="Avatar"
        />
        <h3 class="text-xl font-bold tracking-tight text-gray-900">
          {{ authStore.user?.displayName }}
        </h3>
        <p class="font-light text-gray-500">{{ authStore.user?.email }}</p>
        <button
          class="px-5 text-sm font-medium text-gray-900 py-2.5 bg-white border-gray-200 border rounded-lg justify-center align-center w-full inline-flex mt-5 hover:text-primary-700 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:z-10"
          @click="onLogoutClicked"
        >
          <font-awesome-icon
            class="w-5 h-5 mr-1"
            icon="fa-solid fa-arrow-right-from-bracket"
          />
          <span>Logout</span>
        </button>
      </div>
      <ul class="space-y-2">
        <li v-for="page in pages" :key="page.name">
          <router-link
            @click="$emit('closeSidebar')"
            exact-active-class="text-white bg-primary-600"
            class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-primary-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300"
            :to="page.to"
          >
            <font-awesome-icon class="w-6 h-6" :icon="page.icon" />
            <span class="ml-3">{{ page.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>
