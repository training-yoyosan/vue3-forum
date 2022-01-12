import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home";
import NotFound from "@/views/NotFound";
import Forum from "@/views/Forum";
import Category from "@/views/Category";
import store from "@/store";
import { findById } from "@/helpers";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/me",
    name: "Profile",
    component: () => import("@/views/Profile"),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true },
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    component: () => import("@/views/Profile"),
    props: { edit: true },
    meta: { requiresAuth: true },
  },
  /*  {
    path: "/test",
    name: "Test",
    component: () => import("@/views/Test"),
  },*/
  {
    path: "/category/:id",
    name: "Category",
    component: Category,
    props: true,
    async beforeEnter(to, from, next) {
      await store.dispatch("categories/fetchCategory", { id: to.params.id });
      const categoryExists = findById(store.state.categories.items, to.params.id);

      if (categoryExists) {
        next();
      } else {
        next({
          name: "NotFound",
          params: { pathMatch: to.path.substring(1).split("/") },
          query: to.query,
          hash: to.hash,
        });
      }
    },
  },
  {
    path: "/forum/:id",
    name: "Forum",
    component: Forum,
    props: true,
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: () => import("@/views/ThreadShow"),
    props: true,
    async beforeEnter(to, from, next) {
      await store.dispatch("threads/fetchThread", { id: to.params.id, once: true });
      const threadExists = findById(store.state.threads.items, to.params.id);

      if (threadExists) {
        next();
      } else {
        next({
          name: "NotFound",
          params: { pathMatch: to.path.substring(1).split("/") },
          query: to.query,
          hash: to.hash,
        });
      }
    },
  },
  {
    path: "/forum/:forumId/thread/create",
    name: "ThreadCreate",
    component: () => import("@/views/ThreadCreate"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    component: () => import("@/views/ThreadEdit"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register"),
    meta: { requiresGuest: true },
  },
  {
    path: "/signin",
    name: "SignIn",
    component: () => import("@/views/SignIn"),
    meta: { requiresGuest: true },
  },
  {
    path: "/signout",
    name: "SignOut",
    async beforeEnter() {
      await store.dispatch("auth/signOut");
      return { name: "Home" };
    },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = "smooth";

    return scroll;
  },
});

router.beforeEach(async (to) => {
  await store.dispatch("auth/initAuthentication");
  await store.dispatch("unsubscribeAllSnapshots");

  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: "SignIn", query: { redirectTo: to.path } };
  }

  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: "Home" };
  }
});

export default router;
