<template>
  <v-dialog v-model="dialog" width="600">

    <v-card>
      <v-card-title class="justify-center">
        {{ isEdit ? 'Events Found...' : 'Add Task' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>






      <div v-for="event in foundEvents" :key="event.id">

          <v-container>
            <v-layout>
              <v-flex xs12 sm6>
                <v-card hover>

                  <v-card-title>
                    <h3 v-if="event.cat=='challenge'">CONFRONT</h3>
                    <h3 v-if="event.cat=='challenge-sms'">CONFRONT</h3>
                    <h3 v-if="event.cat=='secret'">SECRET</h3>
                    <h3 v-if="event.cat=='secret-sms'">SECRET</h3>
                    <h3 v-if="event.cat=='timer'">TIMER</h3>
                    <h3 v-if="event.cat=='timer-sms'">TIMER</h3>
                    <h3 v-if="event.cat=='zone'">GEOFENCE</h3>
                    <h3 v-if="event.cat=='zone-sms'">GEOFENCE</h3>
                    <h3 v-if="event.cat=='user-sms'">USER SMS</h3>
                    <h3 v-if="event.cat=='alarm'">ALARM USED</h3>

                  </v-card-title>

                  <v-card-text>
                    Event Type: {{event.type}}<br>
                    Event Id: {{event.id.replace('found','')}}<br>
                    Location: {{event.time}}
                  </v-card-text>

                  <v-card-actions>
                    <v-btn color=success :href="`https://maps.google.com/?q=${event.location.latitude},${event.location.longitude}`" target="_blank">
                      See on map
                    </v-btn>
                  </v-card-actions>

                </v-card>
              </v-flex>
            </v-layout>
          </v-container>

      </div>


      <v-divider></v-divider>

      <v-card-actions class="pa-2">

        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

/*
|---------------------------------------------------------------------
| TODO Compose Component
|---------------------------------------------------------------------
|
| Compose new tasks editor
*/
import moment from 'moment'
import { db } from '../../../main'
export default {
  data () {
    return {
      dialog: false,
      title: '',
      description: '',
      date: '',
      task: {},
      events:[],
      incidentDate:'',
      foundEvents:[],
      taskLabels: [],
      search: null
    }
  },
  computed: {
    ...mapState('reports-app', ['labels']),
    isEdit() {
      return this.task && this.task.id
    }
  },
  methods: {
    ...mapMutations('reports-app', ['updateReports', 'addReports']),
    open(task) {
      if (task) {
        this.task = task
        this.title = this.task.title
        this.description = this.task.description
        this.date = this.task.date
        this.taskLabels = this.task.labels
        this.events = this.task.events
        this.incidentDate = this.task.docId

        console.log(this.incidentDate)

        this.foundEvents=[]

        let ref = db.collection('challenge').doc(this.incidentDate)
        ref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')

                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such  challenge document!");
              }
        })


        let csmsref = db.collection('challenge-sms').doc(this.incidentDate)
        csmsref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')

                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such  challenge document!");
              }
        })

        let secretref = db.collection('secret').doc(this.incidentDate)
        secretref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND secret')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')
                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such secret document!");
              }
        })

        let smssecretref = db.collection('secret-sms').doc(this.incidentDate)
        smssecretref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')

                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such  challenge document!");
              }
        })


        let timerref = db.collection('timer').doc(this.incidentDate)
        timerref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')

                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such  challenge document!");
              }
        })

        let smstimerref = db.collection('timer-sms').doc(this.incidentDate)
        smstimerref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')

                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such  challenge document!");
              }
        })


        let zoneref = db.collection('zone').doc(this.incidentDate)
        zoneref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')

                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such  challenge document!");
              }
        })

        let smszoneref = db.collection('zone-sms').doc(this.incidentDate)
        smszoneref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')

                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such  challenge document!");
              }
        })

        let smsuserref = db.collection('user-sms').doc(this.incidentDate)
        smsuserref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')

                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such  challenge document!");
              }
        })

        let alarmref = db.collection('alarm').doc(this.incidentDate)
        alarmref.get()
        .then(snapshot => {  //DocSnapshot
              if (snapshot.exists) {
                  let post = snapshot.data()['events']
                  console.log(post)
                  for (var p=0; p<post.length; p++){
                    if (this.events.includes(post[p].eventId)){
                      console.log('FOUND')
                      this.foundEvents.push({
                        id:'found'+post[p].eventId,
                        cat:post[p].category,
                        type: post[p].type,
                        location: post[p].location,
                        time: moment(post[p].time.seconds*1000).format('MMM Do YY')

                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such  challenge document!");
              }
        })

      } else {
        this.task = {}
        this.title = ''
        this.description = ''
        this.date = ''
        this.taskLabels = []
      }

      this.dialog = true
    },
    close() {
      this.dialog = false
    },
    save() {
      const { title, description, taskLabels } = this
      const task = {
        title,
        description,
        labels: taskLabels
      }

      if (this.task.id) {
        this.updateTask({
          ...this.task,
          ...task
        })
      } else {
        this.addTask(task)
      }

      this.close()
    },
    filter (item, queryText, itemText) {
      const hasValue = (val) => val !== null ? val : ''

      const text = hasValue(item.title)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    }
  }
}
</script>
