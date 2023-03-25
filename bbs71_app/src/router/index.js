import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store"

const routes = [
  {
    path: "/login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/",
    component: () => import("../pages/HomePage.vue"),
  },
  {
    name: "airline",
    path: "/airline/:id",
    component: () => import("../pages/AirlinePage.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "airport",
    path: "/airport/:id",
    component: () => import("../pages/AirportPage.vue"),
    meta: { requiresAuth: true }
  },
  {
    path:  '/:pathMatch(.*)*',
    component: () => import("../pages/NotFound.vue")
  }
];


const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = store.state.user.user;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && currentUser === null) {
    next({ path: "/" }); // Redirige al usuario a la página de inicio de sesión
  } else {
    next(); // Permite la navegación
  }
});

export default router;
