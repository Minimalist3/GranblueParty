import VueRouter from 'vue-router'
import store from '../store'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Index.vue'),
      meta: {
        title: 'Granblue Fantasy Tools - Home',
      },
    },
    {
      path: '/builder',
      component: () => import('@/pages/PartyBuilder.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        title: 'Granblue Fantasy Tools - Party Builder',
        desc: 'Build and share Granblue Fantasy teams and grids with your friends. Track and share the characters and summons in your collection.',
        image: 'https://www.granblue.party/img/preview_party.jpg',
      },
    },
    {
      path: '/collection',
      component: () => import('@/pages/CollectionTracker.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        needAuth: true,
        redirectTo: 'collection401',
        title: 'Granblue Fantasy Tools - My Collection',
        desc: 'Track the characters and summons you unlocked, and share your collection with your friends',
        image: 'https://www.granblue.party/img/preview_collection.jpg',
      },
    },
    {
      path: '/collection/:collection_id',
      component: () => import('@/pages/CollectionTracker.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        title: 'Granblue Fantasy Tools - View Collection',
        desc: 'Track the characters and summons you unlocked, and share your collection with your friends',
        image: 'https://www.granblue.party/img/preview_collection.jpg',
      }
    },
    {
      path: '/collection401',
      name: 'collection401',
      component: () => import('@/pages/Collection401.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        title: 'Granblue Fantasy Tools - My Collection',
        desc: 'Track the characters and summons you unlocked, and share your collection with your friends',
        image: 'https://www.granblue.party/img/preview_collection.jpg',
      },
    },
    {
      path: '/account',
      component: () => import('@/pages/Account.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        needAuth: true,        
        title: 'Granblue Fantasy Tools - My Account',
      },
    },
    {
      path: '/calcevoker',
      component: () => import('@/pages/CalcEvoker.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        title: 'Granblue Fantasy Tools - Evoker Calculator',
        desc: 'Get the complete list of materials needed to unlock a specific Arcarum summon and Evoker',
        image: 'https://www.granblue.party/img/preview_calc.jpg',
      },
    },
    {
      path: '/calcgw',
      component: () => import('@/pages/CalcGW.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        title: 'Granblue Fantasy Tools - Guild Wars Tokens Calculator',
        desc: 'Calculator for Guild Wars tokens and boxes',
        image: 'https://www.granblue.party/img/preview_calcgw.jpg',
      },
    },
    {
      path: '/release',
      component: () => import('@/pages/ReleaseSchedule.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        title: 'Granblue Fantasy Tools - Release Schedule',
        desc: 'Take a look at every character and summoned already released, sorted by date',
        image: 'https://www.granblue.party/img/preview_release.jpg',
      },
    },
    {
      path: '/friendsum',
      component: () => import('@/pages/FriendSummons.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        title: 'Granblue Fantasy Tools - Friend Summons',
        desc: 'Set your friend summons and share the link or screenshot to your friends',
        image: 'https://www.granblue.party/img/preview_friendsum.jpg',
      },
    },
    {
      path: '/dailygrind',
      component: () => import('@/pages/DailyGrind.vue'),
      pathToRegexpOptions: { strict: true },
      meta: {
        title: 'Granblue Fantasy Tools - Daily Grind',
        desc: 'Choose the content you want to farm and click Next to grind!',
        image: 'https://www.granblue.party/img/preview_dailygrind.jpg',
      },
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
/// #endif    
    {
      path: '/401',
      name: '401',
      component: () => import('@/pages/NotLoggedIn.vue'),
      meta: {
        title: 'Granblue Fantasy Tools - 401',
      }
    },
    {
      path: '*',
      component: () => import('@/pages/NotFound.vue'),
      meta: {
        title: 'Granblue Fantasy Tools - 404',
        desc: 'Page not found'
      }
    },
  ]
});

// Unauthenticated users are redirected to / on routes with auth
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.needAuth)) {
    if ( ! store.getters.getUsername) {
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

// Change page title
const DEFAULT_TITLE = 'Granblue.Party - Granblue Fantasy Tools';
const DEFAULT_DESC = 'A collection of useful tools for Granblue Fantasy';
const DEFAULT_IMAGE = 'https://www.granblue.party/img/preview_party.jpg';

router.afterEach((to, from) => {
  document.title = to.meta.title || DEFAULT_TITLE;
  document.querySelector('meta[name="title"]').setAttribute('content', to.meta.title || DEFAULT_TITLE);
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', to.meta.title || DEFAULT_TITLE);
  document.querySelector('meta[property="og:title"]').setAttribute('content', to.meta.title || DEFAULT_TITLE);

  document.querySelector('meta[name="description"]').setAttribute('content', to.meta.desc || DEFAULT_DESC);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', to.meta.desc || DEFAULT_DESC);
  document.querySelector('meta[property="og:description"]').setAttribute('content', to.meta.desc || DEFAULT_DESC);

  document.querySelector('meta[name="twitter:image"]').setAttribute('content', to.meta.image || DEFAULT_IMAGE);
  document.querySelector('meta[property="og:image"]').setAttribute('content', to.meta.image || DEFAULT_IMAGE);

  document.querySelector('meta[property="og:url"]').setAttribute('content', 'https://www.granblue.party' + to.path);
});

export default router;