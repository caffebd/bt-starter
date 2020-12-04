import newsfeedRoutes from '../apps/newsfeed/routes'
import Router from 'vue-router'
import store from '../store'

export default [{
  path: '/apps/newsfeed',
  beforeEnter: guard,
  component: () => import(/* webpackChunkName: "apps-newsfeed" */ '@/apps/newsfeed/NewsfeedApp.vue'),
  children: [
    ...newsfeedRoutes
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
