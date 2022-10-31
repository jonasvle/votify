import { defineStore } from "pinia";
import { signInWithEmailAndPassword, signOut, type User } from "firebase/auth";

import { auth } from "@/configs/firebase";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async setUser() {
      return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          this.user = user;
          unsubscribe();
          resolve(user);
        }, reject);
      });
    },
    async login(email: string, password: string) {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        this.user = response.user;
      } else {
        throw new Error("login failed");
      }
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
  },
});
