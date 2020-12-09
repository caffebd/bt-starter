export default [{
  path: '',
  redirect: 'alerts'
}, {
  path: 'alerts',
  name: 'apps-alerts-alerts',
  component: () => import(/* webpackChunkName: "apps-alerts-tasks" */ '@/apps/alerts/pages/AlertsTasksPage.vue')
}, {
  path: 'completed',
  name: 'apps-alerts-completed',
  component: () => import(/* webpackChunkName: "apps-alerts-completed" */ '@/apps/alerts/pages/AlertsCompletedPage.vue')
}, {
  path: 'label/:id',
  name: 'apps-alerts-label',
  component: () => import(/* webpackChunkName: "apps-alerts-label" */ '@/apps/alerts/pages/AlertsLabelPage.vue')
}]
