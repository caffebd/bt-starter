import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import AppsRoutes from './apps.routes'
import FeedbackRoutes from './apps.feedback'
import ReportsRoutes from './apps.reports'
import NewsfeedRoutes from './apps.newsfeed'

// Routes
import PagesRoutes from './pages.routes'
import UsersRoutes from './users.routes'

Vue.use(Router)

export const routes = [{
  path: '/',
  redirect: '/dashboard/analytics'
}, {
  path: '/dashboard/analytics',
  name: 'dashboard-analytics',
  beforeEnter: guard,
  component: () => import(/* webpackChunkName: "dashboard" */ '@/pages/dashboard/DashboardPage.vue')
},
...PagesRoutes,
...UsersRoutes,
...AppsRoutes,
...FeedbackRoutes,
...ReportsRoutes,
...NewsfeedRoutes,
{
  path: '/blank',
  name: 'blank',
  component: () => import(/* webpackChunkName: "blank" */ '@/pages/BlankPage.vue')
},
{
  path: '*',
  name: 'error',
  component: () => import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
  meta: {
    layout: 'error'
  }
}]

function guard(to, from, next) {
  if (store.state.user.id) {
    return next()
  } else {
    return next('/auth/signin')
  }
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})

/**
 * Before each route update
 */
router.beforeEach((to, from, next) => {
  return next()
})

/**
 * After each route update
 */
router.afterEach((to, from) => {
})

export default router
