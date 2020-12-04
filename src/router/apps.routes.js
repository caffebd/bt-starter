import todoRoutes from '../apps/todo/routes'
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

export default [{
  path: '/apps/todo',
  beforeEnter: guard,
  component: () => import(/* webpackChunkName: "apps-todo" */ '@/apps/todo/TodoApp.vue'),
  children: [
    ...todoRoutes
  ]
}
]

function guard(to, from, next) {
  if (store.state.user.isAdmin) {
    return next()
  } else if (store.state.user.id) {
    return
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
  }
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
