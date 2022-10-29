import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth";

const checkLoggedIn = async (_to: any, _from: any, next: any) => {
  const authStore = useAuthStore();
  await authStore.setUser();
  if (authStore.user) {
    next();
  } else {
    next({ name: "login" });
  }
};

const checkLoggedOut = async (_to: any, _from: any, next: any) => {
  const authStore = useAuthStore();
  await authStore.setUser();
  if (!authStore.user) {
    next();
  } else {
    next({ name: "home" });
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/AuthenticatedView.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
          meta: { title: "Home" },
        },
        {
          path: "members",
          name: "members",
          component: () => import("@/views/MembersView.vue"),
          meta: { title: "Members" },
        },
      ],
      beforeEnter: checkLoggedIn,
    },
    {
      path: "/",
      component: () => import("@/views/UnauthenticatedView.vue"),
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("@/views/LoginView.vue"),
          meta: { title: "Login" },
        },
      ],
      beforeEnter: checkLoggedOut,
    },
  ],
});

export default router;
