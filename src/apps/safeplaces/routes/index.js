export default [{
  path: '',
  redirect: 'safeplaces'
}, {
  path: 'safeplaces',
  name: 'apps-safeplaces-safeplaces',
  component: () => import(/* webpackChunkName: "apps-safeplaces-feedback" */ '@/apps/safeplaces/pages/SafeplacesTasksPage.vue')
}, {
  path: 'completed',
  name: 'apps-safeplaces-completed',
  component: () => import(/* webpackChunkName: "apps-safeplaces-completed" */ '@/apps/safeplaces/pages/SafeplacesCompletedPage.vue')
}, {
  path: 'label/:id',
  name: 'apps-safeplaces-label',
  component: () => import(/* webpackChunkName: "apps-safeplaces-label" */ '@/apps/safeplaces/pages/SafeplacesLabelPage.vue')
}]
