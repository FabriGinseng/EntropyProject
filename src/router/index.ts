import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Sidebar,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
