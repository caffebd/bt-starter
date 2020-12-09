<template>
  <div class="d-flex flex-grow-1 flex-row mt-2 ml-4">
    <v-navigation-drawer
      v-model="drawer"
      :app="$vuetify.breakpoint.mdAndDown"
      :permanent="$vuetify.breakpoint.lgAndUp"
      floating
      class="elevation-1 rounded flex-shrink-0"
      :right="$vuetify.rtl"
      :class="[$vuetify.rtl ? 'ml-3' : 'mr-3']"
      width="340"
    >
      <alerts-menu class="todo-app-menu pa-2" @open-compose="openCompose"></alerts-menu>
    </v-navigation-drawer>

    <div class="d-flex flex-grow-1 flex-column">
      <v-toolbar class="hidden-lg-and-up flex-grow-0 mb-2">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="title font-weight-bold">Alerts App</div>
      </v-toolbar>
      <router-view :key="$route.fullPath" class="flex-grow-1" @edit-task="openCompose"></router-view>
    </div>

    <alerts-compose ref="compose" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AlertsMenu from './components/AlertsMenu'
import AlertsCompose from './components/AlertsCompose'

/*
|---------------------------------------------------------------------
| Alerts Application Component
|---------------------------------------------------------------------
|
| Application layout
|
*/
import { mapState, mapMutations } from 'vuex'
import { db } from '../../main'
import moment from 'moment'
export default {
  components: {
    AlertsMenu,
    AlertsCompose
  },
  data() {
    return {
      drawer: null,
      alerts:[]
    }
  },
  created() {
    var tempHolder=[]
    this.clearAlerts()
    let maxDays = 10
    this.$store.state.user.viewingAlerts=true

    let allTheItems = [
      db.collection('challenge'),
      db.collection('challenge-sms'),
      db.collection('timer'),
      db.collection('timer-sms'),
      db.collection('zone'),
      db.collection('zone-sms'),
      db.collection('secret'),
      db.collection('secret-sms'),
      db.collection('alarm'),
      db.collection('users-sms'),

      ]

    //let refalarm= db.collection('alarm')
    for (var a=0; a<allTheItems.length; a++){
    allTheItems[a].onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {

        let doc = change.doc

        let events = doc.data()['events']

        for (var d=0; d < events.length; d++){

          var ourDate = new Date()

          var pastDate = ourDate.getDate() - maxDays
          ourDate.setDate(pastDate)

          var compDate = events[d].time.toDate()

          var sortTime = events[d].time.seconds*1000
          var myDate = moment(sortTime).format('MMM Do YY')

          console.log('*** NEW '+events[d].eventId)

          if (moment(compDate).isAfter(ourDate)){

          const aTask = {
                id: events[d].eventId,
                date: myDate,
                sortDate:  sortTime,
                location: events[d].location,
                labels: [events[d].category],
                category: events[d].category,
                type: events[d].type,
                userphone: events[d].userPhone ?? 'no phone',
                completed: false
              }
            if (this.$store.state.user.viewingAlerts==false){
              console.log(change.type)

              this.$store.state.user.color='blue'
              this.$store.state.user.newMessages ++

            }else{
              this.$store.state.user.color='blue'
              this.$store.state.user.newMessages = 0
            }
            this.addAlerts(aTask)
        }

        }

      })
    })

    }
    //     let doc = change.doc
    //     var sortTime = doc.data()['date'].seconds*1000
    //     var myDate = moment(sortTime).format('MMM Do YY')

    //     if (change.type=='removed'){

    //       this.deleteAlerts(doc.id+'data')

    //       }else if (change.type=='modified') {

    //           const aTask = {
    //             id: doc.id+'data',
    //             title: 'Delete Data',
    //             description: doc.data()['userPhone'],
    //             date: myDate,
    //             sortDate:  sortTime,
    //             labels: ['data'],
    //             completed: false
    //           }

    //         this.updateAlerts(aTask)

    //       }else{

    //     const aTask = {
    //       id: doc.id+'data',
    //       title: 'Delete Data',
    //       description: doc.data()['userPhone'],
    //       date: myDate,
    //       sortDate:  sortTime,
    //       labels: ['data'],
    //       completed: false
    //     }
    //     console.log(aTask.sortDate)
    //     this.addAlerts(aTask)
    //     }
    //   })
    // })




    // db.collection('requestedDeleteAccount').get()
    // .then((querySnapshot) => {
      // querySnapshot.forEach((doc) => {
      //   console.log (doc.data())
      //   const fbTask = doc.data()

      //   fbTask.id = doc.id
      //   this.tasks.push(fbTask)
      //    var sortTime = doc.data()['date'].seconds*1000
      //    var myDate = moment(sortTime).format('MMM Do YY')

      //   const aTask = {
      //     id: doc.id+'account',
      //     title: 'Delete Account',
      //     description: doc.data()['userPhone'],
      //     date: myDate,
      //     sortDate:  sortTime,
      //     labels: ['account'],
      //     completed: false
      //   }
      //   tempHolder.push(aTask)
      //   this.addTask(tempHolder[i])

      // })
    // db.collection('requestedDeleteData').get()
    // .then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     console.log (doc.data())
    //     const fbTask = doc.data()

    //     fbTask.id = doc.id
    //     this.tasks.push(fbTask)
    //      var sortTime = doc.data()['date'].seconds*1000
    //      var myDate = moment(sortTime).format('MMM Do YY')

    //     const bTask = {
    //       id: doc.id+'data',
    //       title: 'Delete Data',
    //       description: doc.data()['userPhone'],
    //       date: myDate,
    //       sortDate:  sortTime,
    //       labels: ['data'],
    //       completed: false
    //     }
    //     tempHolder.push(bTask)

    //   })
    //     tempHolder.sort((a, b) => (a.sortDate < b.sortDate) ? 1 : -1)
    //     for (var i=0; i<tempHolder.length; i++){
    //       this.addTask(tempHolder[i])
    //     }
    // })

   // })





    //this.addTask(tempHolder)
  },
  methods: {
    ...mapMutations('alerts-app', ['updateAlerts', 'addAlerts', 'clearAlerts', 'deleteAlerts']),
    openCompose(task) {
      this.$refs.compose.open(task)
    }
    // taskAdding() {
    //   this.addTask(task)
    // }
  }

}
</script>
