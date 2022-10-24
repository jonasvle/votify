import { createRouter, createWebHistory } from "vue-router";

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
          component: () => import("@/components/HomeContainer.vue"),
          meta: { title: "Home" },
        },
        {
          path: "members",
          name: "members",
          component: () => import("@/components/MembersContainer.vue"),
          meta: { title: "Members" },
        },
      ],
    },
    {
      path: "/",
      component: () => import("@/views/UnauthenticatedView.vue"),
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("@/components/LoginCard.vue"),
          meta: { title: "Login" },
        },
      ],
    },
  ],
});

export default router;
