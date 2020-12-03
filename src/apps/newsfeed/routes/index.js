export default [{
  path: '',
  redirect: 'newsfeed'
}, {
  path: 'newsfeed',
  name: 'apps-newsfeed-newsfeed',
  component: () => import(/* webpackChunkName: "apps-newsfeed-feedback" */ '@/apps/newsfeed/pages/NewsfeedTasksPage.vue')
}, {
  path: 'completed',
  name: 'apps-newsfeed-completed',
  component: () => import(/* webpackChunkName: "apps-newsfeed-completed" */ '@/apps/newsfeed/pages/NewsfeedCompletedPage.vue')
}, {
  path: 'label/:id',
  name: 'apps-newsfeed-label',
  component: () => import(/* webpackChunkName: "apps-newsfeed-label" */ '@/apps/newsfeed/pages/NewsfeedLabelPage.vue')
}]
