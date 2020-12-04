<template>
  <v-card class="min-w-0">
    <v-text-field
      v-model="filter"
      class="pa-1 py-2 newsfeed-filter elevation-1"
      placeholder="Filter news"
      prepend-inner-icon="mdi-magnify"
      hide-details
      block
      clearable
      solo
      flat
    ></v-text-field>

    <v-divider></v-divider>

    <div v-if="newsfeed.length === 0">
      <div class="px-1 py-6 text-center">No news</div>
    </div>

    <v-slide-y-transition
      v-else
      group
      tag="div"
    >
      <div v-for="task in visiblenewsfeed" :key="task.id" @click="$emit('edit-newsfeed', task)" class="d-flex pa-2 task-item align-center" >
        <!-- @click="$emit('edit-task', task)" was in above line-->
        <v-checkbox
          :input-value="task.completed"
          class="mt-0 pt-0"
          hide-details
          off-icon="mdi-checkbox-blank-circle-outline"
          on-icon="mdi-checkbox-marked-circle"
          @click.stop="task.completed ? setIncomplete(task) : setComplete(task)"
        ></v-checkbox>

        <div class="task-item-content flex-grow-1" :class="{ 'complete': task.completed }">
          <div>
            <v-chip
              v-for="label in task.labels"
              :key="label"
              :color="getLabelColor(label)"
              class="font-weight-bold mt-1 mr-1"
              outlined
              x-small
            >
              {{ getLabelTitle(label) }}
            </v-chip>
          </div>
          <div><p></p></div>
          <div><p>Title: {{task.title}}</p></div>
          <div><p>Author: {{task.author}}</p></div>
          <div><p>Date: {{ readableTime(task.time.seconds * 1000) }}</p></div>
          <div><p>Article: {{task.article}}</p></div>

        </div>

        <div v-show="$store.state.user.isAdmin" class="d-flex align-center">
          <v-btn v-show="$store.state.user.isAdmin" icon @click.stop="beginDelete(task)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </div>
      </div>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

/*
|---------------------------------------------------------------------
| ToDo List Component
|---------------------------------------------------------------------
|
| Task lister
|
*/
import moment from 'moment'
export default {
  props: {
    // task list
    newsfeed: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filter: ''
    }
  },
  computed: {
    ...mapState('newsfeed-app', ['newsfeedlabels']),
    visiblenewsfeed() {
      if (!this.filter)
      return this.newsfeed.sort((a, b) => (a.sortDate < b.sortDate) ? 1 : -1)

      return this.newsfeed.filter((t) => {
        return Boolean(Object.values(t).filter((prop) => typeof prop === 'string').find((item) => item.toLowerCase().includes(this.filter.toLowerCase())))
      })
    }
  },
  methods: {
    ...mapMutations('newsfeed-app', {
      setComplete: 'newsfeedCompleted',
      setIncomplete: 'newsfeedIncomplete',
      deleteNewsfeed: 'deleteNewsfeed'
    }),
    readableTime(seconds){
      return moment(new Date(seconds)).format('Do MMM YY -- H:m')
    },
    getLabelColor(id) {
      const label = this.newsfeedlabels.find((l) => l.id === id)

      return label ? label.color : ''
    },
    getLabelTitle(id) {

      const label = this.newsfeedlabels.find((l) => l.id === id)

      return label ? label.title : ''
    },
    beginDelete(task){
      console.log(this.$store.state.user.isAdmin)
      if (this.$store.state.user.isAdmin){
        this.deleteNewsfeed(task)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.newsfeed-filter {
  position: sticky;
  background-color: var(--v-background-base) !important;
  z-index: 2;
  top: 0;
}

.task-item {
  cursor: pointer;
  border-bottom: 1px solid rgba(100, 100, 100, 0.1);

  &:hover {
    background-color: rgba(100, 100, 100, 0.1);
  }

  .task-item-content {
    &.complete {
      text-decoration: line-through;
    }
  }
}
</style>
