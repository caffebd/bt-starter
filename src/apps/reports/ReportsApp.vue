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
      <reports-menu class="reports-app-menu pa-2" @open-compose="openCompose"></reports-menu>
    </v-navigation-drawer>

    <div class="d-flex flex-grow-1 flex-column">
      <v-toolbar class="hidden-lg-and-up flex-grow-0 mb-2">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="title font-weight-bold">Reports App</div>
      </v-toolbar>
      <router-view :key="$route.fullPath" class="flex-grow-1" @edit-reports="openCompose"></router-view>
    </div>

    <reports-compose ref="compose" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ReportsMenu from './components/ReportsMenu'
import ReportsCompose from './components/ReportsCompose'

/*
|---------------------------------------------------------------------
| REPORTS Application Component
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
    ReportsMenu,
    ReportsCompose
  },
  data() {
    return {
      drawer: null,
      reports:[]
    }
  },
  created() {
    var tempHolder=[]
    this.clearReports()
    db.collection('reportsFiled').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log (doc.data())
        const fbTask = doc.data()['incidents']
        for (var i=0; i<fbTask.length; i++){
          fbTask[i].id = doc.id

          var sortTime = fbTask[i].time.seconds*1000
          var myDate = moment(sortTime).format('MMM Do YY')
          //console.log (myDate)

          if (fbTask[i].type==null){
            fbTask[i].type='Violence'
          }
          var atEvents=[]
          if (fbTask[i].attachedEvents!=null){
            atEvents = fbTask[i].attachedEvents
          }

                const aTask = {
                  id: fbTask[i].reportUid,
                  docId: doc.id,
                  title: 'User Report',
                  description: fbTask[i].description,
                  incidentDate: fbTask[i].incidentDate,
                  target: fbTask[i].target,
                  date: myDate,
                  sortDate:  sortTime,
                  events: atEvents,
                  labels: [fbTask[i].type],
                  phone: fbTask[i].userPhone
                }
                //console.log(fbTask[i].type)
                tempHolder.push(aTask)
          }





      })
       // console.log(tempHolder)
        tempHolder.sort((a, b) => (a.sortDate < b.sortDate) ? 1 : -1)
        for (var i=0; i<tempHolder.length; i++){
          console.log(tempHolder[i])
          this.addReports(tempHolder[i])
        }


    })





    //this.addTask(tempHolder)
  },
  methods: {
    ...mapMutations('reports-app', ['updateReoprts', 'addReports', 'clearReports']),
    openCompose(reports) {
      this.$refs.compose.open(reports)
    }
    // taskAdding() {
    //   this.addTask(task)
    // }
  }

}
</script>
