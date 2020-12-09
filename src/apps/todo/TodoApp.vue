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
      <todo-menu class="todo-app-menu pa-2" @open-compose="openCompose"></todo-menu>
    </v-navigation-drawer>

    <div class="d-flex flex-grow-1 flex-column">
      <v-toolbar class="hidden-lg-and-up flex-grow-0 mb-2">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="title font-weight-bold">Todo App</div>
      </v-toolbar>
      <router-view :key="$route.fullPath" class="flex-grow-1" @edit-task="openCompose"></router-view>
    </div>

    <todo-compose ref="compose" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TodoMenu from './components/TodoMenu'
import TodoCompose from './components/TodoCompose'

/*
|---------------------------------------------------------------------
| TODO Application Component
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
    TodoMenu,
    TodoCompose
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
    this.$store.state.user.viewingAlerts=false

    let refdata= db.collection('requestedDeleteData')

    refdata.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {



        let doc = change.doc
        var sortTime = doc.data()['date'].seconds*1000
        var myDate = moment(sortTime).format('MMM Do YY')

        if (change.type=='removed'){

          this.deleteTask(doc.id+'data')

          }else if (change.type=='modified') {

              const aTask = {
                id: doc.id+'data',
                title: 'Delete Data',
                description: doc.data()['userPhone'],
                date: myDate,
                sortDate:  sortTime,
                labels: ['data'],
                completed: false
              }

            this.updateTask(aTask)

          }else{

        const aTask = {
          id: doc.id+'data',
          title: 'Delete Data',
          description: doc.data()['userPhone'],
          date: myDate,
          sortDate:  sortTime,
          labels: ['data'],
          completed: false
        }
        console.log(aTask.sortDate)
        this.addTask(aTask)
        }
      })
    })


    let refaccount= db.collection('requestedDeleteAccount')

    refaccount.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {



        let doc = change.doc
        var sortTime = doc.data()['date'].seconds*1000
        var myDate = moment(sortTime).format('MMM Do YY')

        console.log(change.type +'   '+doc.id+'account')

        if (change.type=='removed'){

          this.deleteTask(doc.id+'account')

          }else if (change.type=='modified') {

              const aTask = {
                id: doc.id+'account',
                title: 'Delete Account',
                description: doc.data()['userPhone'],
                date: myDate,
                sortDate:  sortTime,
                labels: ['account'],
                completed: false
              }

            this.updateTask(aTask)

          }else{

        const aTask = {
          id: doc.id+'account',
          title: 'Delete Account',
          description: doc.data()['userPhone'],
          date: myDate,
          sortDate:  sortTime,
          labels: ['account'],
          completed: false
        }
        this.addTask(aTask)
          }
      })
    })

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
    ...mapMutations('todo-app', ['updateTask', 'addTask', 'clearTasks', 'deleteTask']),
    openCompose(task) {
      this.$refs.compose.open(task)
    }
    // taskAdding() {
    //   this.addTask(task)
    // }
  }

}
</script>
