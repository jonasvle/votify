import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

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
    async register(email: string, password: string, displayName: string) {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (response) {
        this.user = response.user as User;
        updateProfile(this.user, { displayName: displayName });
      } else {
        throw new Error("register failed");
      }
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
  },
});
