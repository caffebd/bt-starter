import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'

// VUEX - https://vuex.vuejs.org/
import store from './store'

// VUE-ROUTER - https://router.vuejs.org/
import router from './router'

// PLUGINS
import vuetify from './plugins/vuetify'
import i18n from './plugins/vue-i18n'
import './plugins/vue-google-maps'
import './plugins/vue-shortkey'
import './plugins/vue-head'
import './plugins/vue-gtag'
import './plugins/apexcharts'
import './plugins/echarts'
import './plugins/animate'
import './plugins/clipboard'
import './plugins/moment'

// FILTERS
import './filters/capitalize'
import './filters/lowercase'
import './filters/uppercase'
import './filters/formatCurrency'
import './filters/formatDate'

// STYLES
// Main Theme SCSS
import './assets/scss/theme.scss'

// Animation library - https://animate.style/
import 'animate.css/animate.min.css'

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false

var firebaseConfig = {
    apiKey: "AIzaSyCw2y2mEZjLeW0fiZQO8zwKrFlOlWf6w58",
    authDomain: "bhaithamen.firebaseapp.com",
    databaseURL: "https://bhaithamen.firebaseio.com",
    projectId: "bhaithamen",
    storageBucket: "bhaithamen.appspot.com",
    messagingSenderId: "151240183995",
    appId: "1:151240183995:web:543394afb314ce73ed199e",
    measurementId: "G-Z102EG94W1"
  };

//testdb
// const firebaseConfig = {
//   apiKey: 'AIzaSyAQpL0k9nx0E3hCfBSVntWXyjOv2LRb-6M',
//   authDomain: 'bhaithamendashboard.firebaseapp.com',
//   databaseURL: 'https://bhaithamendashboard.firebaseio.com',
//   projectId: 'bhaithamendashboard',
//   storageBucket: 'bhaithamendashboard.appspot.com',
//   messagingSenderId: '311902176109',
//   appId: '1:311902176109:web:cbc2fd3b412435c2245064',
//   measurementId: 'G-RGJ86DVN8V'
// }
// Initialize Firebase

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

const { TimeStamp, GeoPoint } = firebase.firestore

export { TimeStamp, GeoPoint }

/*
|---------------------------------------------------------------------
| Main Vue Instance
|---------------------------------------------------------------------
|
| Render the vue application on the <div id="app"></div> in index.html
|
| https://vuejs.org/v2/guide/instance.html
|
*/
export default new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
