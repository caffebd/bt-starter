export default [{
  path: '',
  redirect: 'reports'
}, {
  path: 'reports',
  name: 'apps-reports-reports',
  component: () => import(/* webpackChunkName: "apps-reports-feedback" */ '@/apps/reports/pages/ReportsTasksPage.vue')
}, {
  path: 'completed',
  name: 'apps-reports-completed',
  component: () => import(/* webpackChunkName: "apps-reports-completed" */ '@/apps/reports/pages/ReportsCompletedPage.vue')
}, {
  path: 'label/:id',
  name: 'apps-reports-label',
  component: () => import(/* webpackChunkName: "apps-reports-label" */ '@/apps/reports/pages/ReportsLabelPage.vue')
}]
