<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import InlineErrorNotification from "@/components/InlineErrorNotification.vue";

const nameRef = ref("");
const emailRef = ref("");
const passwordRef = ref("");
const errorRef = ref("");
const showPassword = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const register = async () => {
  try {
    await authStore.register(emailRef.value, passwordRef.value, nameRef.value);
    router.replace({ name: "home" });
  } catch (error) {
    if (error instanceof Error) {
      errorRef.value = error.message;
    }
  }
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
  >
    <img class="mb-6 w-72" src="@/assets/logo.svg" alt="Votify" />
    <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h2
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          Sign up
        </h2>
        <InlineErrorNotification class="mb-4" :error="errorRef" />
        <form class="space-y-4 md:space-y-6" @submit.prevent="register">
          <div>
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Your name</label
            >
            <input
              type="text"
              name="name"
              id="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="John Smith"
              required
              v-model="nameRef"
            />
          </div>
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Your email</label
            >
            <input
              type="email"
              name="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="john@mail.com"
              required
              v-model="emailRef"
            />
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900"
              >Password</label
            >
            <div v-if="!showPassword" class="relative">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-9"
                required
                v-model="passwordRef"
              />
              <button
                @click="showPassword = true"
                type="button"
                class="absolute top-0 bottom-0 right-0"
              >
                <font-awesome-icon
                  class="w-5 h-5 p-2.5 text-gray-500"
                  icon="fa-solid fa-eye"
                />
              </button>
            </div>
            <div v-else class="relative">
              <input
                type="text"
                name="password"
                id="password"
                placeholder="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-9"
                required
                v-model="passwordRef"
              />
              <button
                @click="showPassword = false"
                type="button"
                class="absolute top-0 bottom-0 right-0"
              >
                <font-awesome-icon
                  class="w-5 h-5 p-2.5 text-gray-500"
                  icon="fa-solid fa-eye-slash"
                />
              </button>
            </div>
          </div>
          <button
            type="submit"
            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign up
          </button>
          <p class="text-sm font-light text-gray-500">
            Already have an account?
            <a
              href="login"
              class="font-medium text-primary-600 hover:underline"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
