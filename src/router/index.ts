import type { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

export const publicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    component: () => import('../views/home/index.vue'),
    meta: { showHeader: true },
  },
  {
    path: '/pledge',
    name: 'pledge',
    component: () => import('../views/pledge/index.vue'),
    meta: { showHeader: true },
  },
  {
    path: '/partner',
    name: 'partner',
    redirect: '/partner/',
    children: [
      {
        path: '/partner',
        component: () => import('../views/partner/index.vue'),
        meta: { showHeader: true },
      },
      {
        path: 'myPartner',
        component: () => import('../views/partner/myPartner.vue'),
        meta: { showHeader: false },
      },
    ],
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('../views/my/index.vue'),
    meta: { showHeader: true },
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/team/index.vue'),
    meta: { showHeader: false },
  },
  {
    path: '/article',
    name: 'article',
    redirect: '/article/',
    children: [
      {
        path: '/article',
        component: () => import('../views/article/index.vue'),
      },
      {
        path: 'detail',
        component: () => import('../views/article/details.vue'),
      },
    ],
  },
  {
    path: '/assets',
    name: 'assets',
    meta: { showHeader: false },
    redirect: '/assets/',
    children: [
      {
        path: '/assets',
        component: () => import('../views/assets/index.vue'),
      },
      {
        path: 'detail',
        component: () => import('../views/assets/details.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: publicRoutes,
});

/* 初始化路由表 */
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}
/* 导出 setupRouter */
export const setupRouter = (app: App<Element>) => {
  app.use(router);
};
