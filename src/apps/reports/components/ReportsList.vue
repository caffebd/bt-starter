<template>
  <v-card class="min-w-0">
    <!-- <v-text-field
      v-model="filter"
      class="pa-1 py-2 reports-filter elevation-1"
      placeholder="Filter reports"
      prepend-inner-icon="mdi-magnify"
      hide-details
      block
      clearable
      solo
      flat
    ></v-text-field> -->

    <v-divider></v-divider>

    <div v-if="reports.length === 0">
      <div class="px-1 py-6 text-center">All done! No more reports!</div>
    </div>

    <v-slide-y-transition
      v-else
      group
      tag="div"
    >
      <div v-for="task in visiblereports" :key="task.id" @click="$emit('edit-reports', task)" class="d-flex pa-2 task-item align-center" >
        <!-- @click="$emit('edit-task', task)" was in above line-->
        <!-- <v-checkbox
          :input-value="task.completed"
          class="mt-0 pt-0"
          hide-details
          off-icon="mdi-checkbox-blank-circle-outline"
          on-icon="mdi-checkbox-marked-circle"
          @click.stop="task.completed ? setIncomplete(task) : setComplete(task)"
        ></v-checkbox> -->

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
          <div><p>Reported Date: {{task.date}}</p></div>
          <div><p>Incident Location: {{task.location}}</p></div>
          <div><p>Incident Date: {{task.location}}</p></div>
          <div><p>Incident Description: {{task.description}}</p></div>
          <div><p>Events: {{task.events}}</p></div>
          <div><p>Contact Number: {{task.phone}}</p></div>

        </div>

        <!-- <div class="d-flex align-center">
          <v-btn icon @click.stop="deleteTask(task)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </div> -->
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
export default {
  props: {
    // task list
    reports: {
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
    ...mapState('reports-app', ['reportslabels']),
    visiblereports() {
      if (!this.filter) return this.reports

      return this.reports.filter((t) => {
        return Boolean(Object.values(t).filter((prop) => typeof prop === 'string').find((item) => item.includes(this.filter)))
      })
    }
  },
  methods: {
    ...mapMutations('reports-app', {
      setComplete: 'reportsCompleted',
      setIncomplete: 'reortsIncomplete',
      deleteReports: 'deleteReports'
    }),
    getLabelColor(id) {
      const label = this.reportslabels.find((l) => l.id === id)

      return label ? label.color : ''
    },
    getLabelTitle(id) {

      const label = this.reportslabels.find((l) => l.id === id)

      return label ? label.title : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.reports-filter {
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
