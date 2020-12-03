import newsfeedRoutes from '../apps/newsfeed/routes'

export default [{
  path: '/apps/newsfeed',
  component: () => import(/* webpackChunkName: "apps-newsfeed" */ '@/apps/newsfeed/NewsfeedApp.vue'),
  children: [
    ...newsfeedRoutes
  ]
}
]
