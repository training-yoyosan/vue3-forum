import { createRouter, createWebHistory } from "vue-router";
import PageHome from "@/components/PageHome";
import PageNotFound from "@/components/PageNotFound";

const routes = [
  {
    path: "/",
    name: "Home",
    component: PageHome,
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
    path: "/test",
    name: "Test",
    component: () => import("@/views/Test"),
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: () => import("@/components/PageThreadShow"),
    props: true,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: PageNotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
