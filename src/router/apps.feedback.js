import feedbackRoutes from '../apps/feedback/routes'

export default [{
  path: '/apps/feedback',
  component: () => import(/* webpackChunkName: "apps-feedback" */ '@/apps/feedback/FeedbackApp.vue'),
  children: [
    ...feedbackRoutes
  ]
}
]
