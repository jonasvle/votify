<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";

const emailRef = ref("");
const passwordRef = ref("");
const errorRef = ref("");

const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  try {
    await authStore.login(emailRef.value, passwordRef.value);
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
    <h1 class="flex items-center mb-6 text-3xl font-semibold text-gray-900">
      Votify
    </h1>
    <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h2
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          Sign in
        </h2>
        <div
          v-if="errorRef"
          class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          <font-awesome-icon
            class="mr-2"
            icon="fa-solid fa-circle-exclamation"
          />
          {{ errorRef }}
        </div>
        <form class="space-y-4 md:space-y-6" @submit.prevent="login">
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
              placeholder="name@company.com"
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
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required
              v-model="passwordRef"
            />
          </div>
          <div class="flex items-center justify-between">
            <!-- <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                    required
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500"
                    >Remember me</label
                  >
                </div>
              </div> -->
            <!-- <a
                href="#"
                class="text-sm font-medium text-primary-600 hover:underline"
                >Forgot password?</a
              > -->
          </div>
          <button
            type="submit"
            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign in
          </button>
          <!-- <p class="text-sm font-light text-gray-500">
              Don’t have an account yet?
              <a href="#" class="font-medium text-primary-600 hover:underline"
                >Sign up</a
              >
            </p> -->
        </form>
      </div>
    </div>
  </div>
</template>
