import store from '../store'

export default [{
  path: '/auth/signin',
  name: 'auth-signin',
  component: () => import(/* webpackChunkName: "auth-signin" */ '@/pages/auth/SigninPage.vue'),
  meta: {
    layout: 'auth'
  }
},
{
  path: '/mapspage',
  name: 'mapspage',
  beforeEnter: guard,
  component: () => import(/* webpackChunkName: "mapspage" */ '@/pages/dashboard/MapsPage.vue')
},
{
  path: '/dashboard/map',
  name: 'map',
  beforeEnter: guard,
  component: () => import(/* webpackChunkName: "map" */ '@/pages/dashboard/MapPage.vue'),
  meta: {
    layout: 'map'
  }
},{
  path: '/newsform',
  name: 'form',
  beforeEnter: guard,
  component: () => import(/* webpackChunkName: "form" */ '@/pages/dashboard/NewsFormPage.vue'),
  meta: {
    layout: 'default'
  }
},  {
  path: '/auth/signup',
  name: 'auth-signup',
  component: () => import(/* webpackChunkName: "auth-signup" */ '@/pages/auth/SignupPage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/auth/verify-email',
  name: 'auth-verify-email',
  component: () => import(/* webpackChunkName: "auth-verify-email" */ '@/pages/auth/VerifyEmailPage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/auth/forgot-password',
  name: 'auth-forgot',
  component: () => import(/* webpackChunkName: "auth-forgot" */ '@/pages/auth/ForgotPage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/auth/reset-password',
  name: 'auth-reset',
  component: () => import(/* webpackChunkName: "auth-reset" */ '@/pages/auth/ResetPage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/error/not-found',
  name: 'error-not-found',
  component: () => import(/* webpackChunkName: "error-not-found" */ '@/pages/error/NotFoundPage.vue'),
  meta: {
    layout: 'error'
  }
}, {
  path: '/error/unexpected',
  name: 'error-unexpected',
  component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/error/UnexpectedPage.vue'),
  meta: {
    layout: 'error'
  }
}, {
  path: '/utility/maintenance',
  name: 'utility-maintenance',
  component: () => import(/* webpackChunkName: "utility-maintenance" */ '@/pages/utility/MaintenancePage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/utility/coming-soon',
  name: 'utility-soon',
  component: () => import(/* webpackChunkName: "utility-soon" */ '@/pages/utility/SoonPage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/utility/help',
  name: 'utility-help',
  component: () => import(/* webpackChunkName: "utility-help" */ '@/pages/utility/HelpPage.vue')
}]

function guard(to, from, next) {
  if (store.state.user.id) {
    return next()
  } else {
    return next('/auth/signin')
  }
}
