import reportsRoutes from '../apps/reports/routes'

export default [{
  path: '/apps/reports',
  component: () => import(/* webpackChunkName: "apps-reports" */ '@/apps/reports/ReportsApp.vue'),
  children: [
    ...reportsRoutes
  ]
}
]
