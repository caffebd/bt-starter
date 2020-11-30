<template>
  <v-dialog v-model="dialog" width="600">
    <v-card>
      <v-card-title class="pa-2">
        {{ isEdit ? 'Events Found...' : 'Add Task' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div>
        <p>Incident Date: {{this.date}}</p>
        <hr class="solid">
      </div>


      <div v-for="event in foundEvents" :key="event.id">
        <h1 v-if="event.cat=='challenge'">CHALLENGE</h1>
        <h1 v-if="event.cat=='secret'">SECRET</h1>
        <div><p>Event Category: {{event.cat}}</p></div>
        <div><p>Event Type: {{event.type}}</p></div>
        <div><p>Event ID: {{event.id.replace('found','')}}</p></div>
        <hr class="solid">
      </div>

      <!-- task form -->
      <div>
        <v-text-field
          v-model="title"
          class="px-2 py-1"
          solo
          flat
          :placeholder="$t('common.title')"
          autofocus
          hide-details
          @keyup.enter="save"
        ></v-text-field>

        <v-divider></v-divider>

        <v-textarea
          v-model="description"
          class="px-2 py-1"
          solo
          flat
          :placeholder="$t('common.description')"
          hide-details
        ></v-textarea>

        <v-textarea
          v-model="events"
          class="px-2 py-1"
          solo
          flat
          :placeholder="$t('common.description')"
          hide-details
        ></v-textarea>

        <v-divider></v-divider>

        <v-textarea
          v-model="date"
          class="px-2 py-1"
          solo
          flat
          :placeholder="$t('common.description')"
          hide-details
        ></v-textarea>

        <v-select
          v-model="taskLabels"
          class="px-2 my-3"
          :menu-props="{ bottom: true, offsetY: true }"
          :items="labels"
          placeholder="Labels"
          item-value="id"
          hide-selected
          hide-details
          solo
          flat
          multiple
        >
          <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip
              v-if="item === Object(item)"
              v-bind="attrs"
              class="font-weight-bold"
              :color="item.color"
              outlined
              :input-value="selected"
              label
            >
              <span class="pr-2">
                {{ item.title }}
              </span>
              <v-icon
                small
                @click="parent.selectItem(item)"
              >close</v-icon>
            </v-chip>
          </template>

          <template v-slot:item="{ index, item }">
            <v-chip
              :color="item.color"
              label
              outlined
              small
            >

            </v-chip>
          </template>
        </v-select>
      </div>

      <v-divider></v-divider>

      <v-card-actions class="pa-2">
        <v-btn outlined @click="close">{{ $t('common.cancel') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">{{ $t('common.save') }}</v-btn>
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
                        location: post[p].location
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
                        location: post[p].location
                        })
                    }
                  }
              } else {
                  // snapshot.data() will be undefined in this case
                  console.log("No such secret document!");
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
