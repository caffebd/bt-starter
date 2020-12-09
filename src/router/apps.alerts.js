import alertsRoutes from '../apps/alerts/routes'
import Router from 'vue-router'
import store from '../store'

export default [{
  path: '/apps/alerts',
  beforeEnter: guard,
  component: () => import(/* webpackChunkName: "apps-alerts" */ '@/apps/alerts/AlertsApp.vue'),
  children: [
    ...alertsRoutes
  ]
}
]

function guard(to, from, next) {
  if (store.state.user.isAdmin) {
    return next()
  } else if (store.state.user.id) {
    return next('/apps/newsfeed')
  } else {
    return next('/auth/signin')
  }
}
