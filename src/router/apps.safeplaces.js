import safeplacesRoutes from '../apps/safeplaces/routes'
import Router from 'vue-router'
import store from '../store'

export default [{
  path: '/apps/safeplaces',
  beforeEnter: guard,
  component: () => import(/* webpackChunkName: "apps-safeplaces" */ '@/apps/safeplaces/SafeplacesApp.vue'),
  children: [
    ...safeplacesRoutes
  ]
}
]

function guard(to, from, next) {
  if (store.state.user.isAdmin) {
    return next()
  } else if (store.state.user.role === 'editor') {
    return next()
  } else {
    return next('/auth/signin')
  }
}
