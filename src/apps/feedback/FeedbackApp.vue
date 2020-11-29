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
      <feedback-menu class="feedback-app-menu pa-2" @open-compose="openCompose"></feedback-menu>
    </v-navigation-drawer>

    <div class="d-flex flex-grow-1 flex-column">
      <v-toolbar class="hidden-lg-and-up flex-grow-0 mb-2">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="title font-weight-bold">feedback App</div>
      </v-toolbar>
      <router-view :key="$route.fullPath" class="flex-grow-1" @edit-task="openCompose"></router-view>
    </div>

    <feedback-compose ref="compose" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import FeedbackMenu from './components/FeedbackMenu'
import FeedbackCompose from './components/FeedbackCompose'

/*
|---------------------------------------------------------------------
| FEEDBACK Application Component
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
    FeedbackMenu,
    FeedbackCompose
  },
  data() {
    return {
      drawer: null,
      tasks:[]
    }
  },
  created() {
    var tempHolder=[]
    this.clearTasks()
    db.collection('appFeedback').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log (doc.data())
        const fbTask = doc.data()

        fbTask.id = doc.id
        this.tasks.push(fbTask)
         var sortTime = doc.data()['date'].seconds*1000
         var myDate = moment(sortTime).format('MMM Do YY')

        const aTask = {
          id: doc.id+'account',
          title: 'User Feedback',
          description: doc.data()['message'],
          date: myDate,
          sortDate:  sortTime,
          labels: [doc.data()['topic']],
          completed: false
        }
        tempHolder.push(aTask)

      })

        tempHolder.sort((a, b) => (a.sortDate < b.sortDate) ? 1 : -1)
        for (var i=0; i<tempHolder.length; i++){
          this.addTask(tempHolder[i])
        }


    })





    //this.addTask(tempHolder)
  },
  methods: {
    ...mapMutations('feedback-app', ['updateTask', 'addTask', 'clearTasks']),
    openCompose(task) {
      this.$refs.compose.open(task)
    }
    // taskAdding() {
    //   this.addTask(task)
    // }
  }

}
</script>
