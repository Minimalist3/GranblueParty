import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter(store) {
  const router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "index" */ '@/pages/Index.vue'),
      },
      {
        path: '/builder',
        component: () => import(/* webpackChunkName: "builder" */ '@/pages/PartyBuilder.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/collection',
        name: 'collection',
        component: () => import(/* webpackChunkName: "collection" */ '@/pages/CollectionTracker.vue'),
        pathToRegexpOptions: { strict: true },
        meta: {
          needAuth: true,
          redirectTo: 'collection401',
        },
      },
      {
        path: '/collection/:collection_id',
        component: () => import(/* webpackChunkName: "collection" */ '@/pages/CollectionTracker.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/collection401',
        name: 'collection401',
        component: () => import(/* webpackChunkName: "collection" */ '@/pages/Collection401.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/account',
        component: () => import(/* webpackChunkName: "account" */ '@/pages/Account.vue'),
        pathToRegexpOptions: { strict: true },
        meta: {
          needAuth: true,        
        },
      },
      {
        path: '/calcevoker',
        component: () => import(/* webpackChunkName: "evoker" */ '@/pages/CalcEvoker.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/calcgw',
        component: () => import(/* webpackChunkName: "gw" */ '@/pages/CalcGW.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/calcevent',
        component: () => import(/* webpackChunkName: "calcevent" */ '@/pages/CalcEvent.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/release',
        component: () => import(/* webpackChunkName: "schedule" */ '@/pages/ReleaseSchedule.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/friendsum',
        component: () => import(/* webpackChunkName: "friend" */ '@/pages/FriendSummons.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/dailygrind',
        component: () => import(/* webpackChunkName: "daily" */ '@/pages/DailyGrind.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/roomname',
        component: () => import(/* webpackChunkName: "roomname" */ '@/pages/RoomName.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/search',
        component: () => import(/* webpackChunkName: "search" */ '@/pages/Search.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/spark',
        component: () => import(/* webpackChunkName: "spark" */ '@/pages/Spark.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/replicard',
        component: () => import(/* webpackChunkName: "replicard" */ '@/pages/Replicard.vue'),
        pathToRegexpOptions: { strict: true },
      },
  /// #if DEBUG
      {
        path: '/admin',
        component: () => import('@/pages/admin/Index.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/admin/weapons',
        component: () => import('@/pages/admin/Weapons.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/admin/summons',
        component: () => import('@/pages/admin/Summons.vue'),
        pathToRegexpOptions: { strict: true },
      },
      {
        path: '/admin/sandbox',
        component: () => import('@/pages/admin/Sandbox.vue'),
        pathToRegexpOptions: { strict: true },
      },
  /// #endif
      {
        path: '/401',
        name: '401',
        component: () => import(/* webpackChunkName: "error" */ '@/pages/401.vue'),
      },
      {
        path: '*',
        component: () => import(/* webpackChunkName: "error" */ '@/pages/404.vue'),
      },
    ]
  });

  // Unauthenticated users are redirected to / on routes with auth
  router.beforeResolve((to, from, next) => {
    if(to.matched.some(record => record.meta.needAuth)) {
      if ( ! store.getters.getUserId) {
        next({name: to.meta.redirectTo ? to.meta.redirectTo : "401"});
      }
      else {
        next();
      }
    }
    else {
      next();
    }
  });

  return router;
}