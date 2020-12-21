import menuPages from './menus/pages.menu'
import firebase from 'firebase'

export default {
  // main navigation - side menu
  menu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-alert-circle-outline', key: 'menu.appAlerts', text: 'Alerts Page', link: '/apps/alerts' },
      { icon: 'mdi-newspaper-variant-outline', key: 'menu.formspage', text: 'News Pages Top', link: '/apps/newsfeed' },
      { icon: 'mdi-map-legend', key: 'menu.placespage', text: 'Places Pages Top', link: '/apps/safeplaces' },
      { icon: 'mdi-chart-bar', key: 'menu.dashboard', text: 'Dashboard', link: '/dashboard/analytics' },
      { icon: 'mdi-map-search-outline', key: 'menu.mapspage', text: 'Maps', link: '/mapspage' },
      //{ icon: 'mdi-file-outline', key: 'menu.blank', text: 'Map Page', link: '/dashboard/map' },
      { icon: 'mdi-cellphone-arrow-down', key: 'menu.appActions', text: 'Action Page', link: '/apps/todo' },
      { icon: 'mdi-comment-edit-outline', key: 'menu.appFeedback', text: 'Feedback Page', link: '/apps/feedback' },
      { icon: 'mdi-clipboard-account-outline', key: 'menu.appReports', text: 'Reports Page', link: '/apps/reports' },
      { icon: 'mdi-newspaper-variant-outline', key: 'menu.formspage', text: 'News Pages Bottom', link: '/apps/newsfeed' },
      { icon: 'mdi-map-legend', key: 'menu.placespage', text: 'Places Pages Bottom', link: '/apps/safeplaces' }
    ]
  }],

  footer: [{
    color: 'red',
    text: 'Docs',
    key: 'usermenu.signout',
    href: 'https://vuetifyjs.com',
    target: '_blank'
  }],

  methods: {
    async logoutNow() {
      await firebase.auth().signOut()
      this.$store.dispatch('user/clearUserData')
      this.$router.replace('/auth/signin')
    }
  }
}
