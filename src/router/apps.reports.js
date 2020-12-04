import reportsRoutes from '../apps/reports/routes'
import Router from 'vue-router'
import store from '../store'

export default [{
  path: '/apps/reports',
  beforeEnter: guard,
  component: () => import(/* webpackChunkName: "apps-reports" */ '@/apps/reports/ReportsApp.vue'),
  children: [
    ...reportsRoutes
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
