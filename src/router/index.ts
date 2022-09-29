import {
  createRouter,
  createWebHistory,
  RouteRecordNormalized,
  RouteRecordRaw,
} from "vue-router";
import ShirtsView from "../views/ShirtsView.vue";
import MainContainer from "../containers/MainContainer.vue";
import store from "../store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    // redirect: '/login',
    name: "Home",
    component: MainContainer,
    children: [
      {
        path: "/",
        name: "shirts",
        component: () => import("../views/ShirtsView.vue"),
      },
      {
        path: "/myDesigns",
        name: "myDesigns",
        component: () => import("../views/MyDesignsView.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/detail/:id?",
        name: "detail",
        component: () => import("../views/DetailView.vue"),
        props: true,
      },
      {
        path: "/editor",
        name: "editor",
        component: () => import("../views/EditorView.vue"),
      },
      {
        path: "/sells",
        name: "sells",
        component: () => import("../views/SellsView.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("../views/OrdersView.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("shirtsUser");
  const user = JSON.parse(loggedIn as string);

  // console.log(loggedIn, user, to, from, !user, store);

  if (user) store.commit("setRegisterOrLogin", user);

  if (to.meta.requiresAuth && !user) {
    console.log(to.meta.requiresAuth, user);
    return next(from.path);
  }
  // else {
  //   next(from.path);
  // }
  // if (!loggedIn) {
  //   return next("/");
  // }

  // if (loggedIn && user) {

  // }
  next();
});

export default router;
