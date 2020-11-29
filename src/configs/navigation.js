import menuPages from './menus/pages.menu'
import firebase from 'firebase'

export default {
  // main navigation - side menu
  menu: [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-chart-bar', key: 'menu.dashboard', text: 'Dashboard', link: '/dashboard/analytics' },
      { icon: 'mdi-map-search-outline', key: 'menu.mapspage', text: 'Maps', link: '/mapspage' },
      //{ icon: 'mdi-file-outline', key: 'menu.blank', text: 'Map Page', link: '/dashboard/map' },
      { icon: 'mdi-lead-pencil', key: 'menu.appActions', text: 'Action Page', link: '/apps/todo' },
      { icon: 'mdi-comment-edit-outline', key: 'menu.appFeedback', text: 'Feedback Page', link: '/apps/feedback' }
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
