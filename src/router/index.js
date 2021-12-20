import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home";
import NotFound from "@/views/NotFound";
import sourceData from "@/data.json";
import Forum from "@/views/Forum";
import Category from "@/views/Category";

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
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/me",
    name: "Profile",
    component: () => import("@/views/Profile"),
    meta: { toTop: true, smoothScroll: true },
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    component: () => import("@/views/Profile"),
    props: { edit: true },
  },
  {
    path: "/test",
    name: "Test",
    component: () => import("@/views/Test"),
  },
  {
    path: "/category/:id",
    name: "Category",
    component: Category,
    props: true,
    beforeEnter(to, from, next) {
      const categoryExists = sourceData.categories.find(
        (category) => category.id === to.params.id
      );

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
    /*beforeEnter(to, from, next) {
      const threadExists = sourceData.threads.find(
        (thread) => thread.id === to.params.id
      );

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
    },*/
  },
  {
    path: "/forum/:forumId/thread/create",
    name: "ThreadCreate",
    component: () => import("@/views/ThreadCreate"),
    props: true,
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    component: () => import("@/views/ThreadEdit"),
    props: true,
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

export default router;
