<template>
  <v-card class="min-w-0">
    <!-- <v-text-field
      v-model="filter"
      class="pa-1 py-2 todo-filter elevation-1"
      placeholder="Filter tasks"
      prepend-inner-icon="mdi-magnify"
      hide-details
      block
      clearable
      solo
      flat
    ></v-text-field> -->

    <v-divider></v-divider>


    <div v-if="myAlerts.length==0">
      <div class="px-1 py-6 text-center">Alerts loading...</div>
    </div>

    <v-slide-y-transition
      v-else
      group
      tag="div"
    >

        <div v-for="(task, i) in visibleAlerts" :key="i" class="d-flex pa-2 task-item align-center">
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
          <div class="font-weight-bold" v-text="task.category"></div>
          <div v-text="task.date"></div>
          <div v-text="task.userphone"></div>
          <div v-text="task.type"></div>
          <div v-text="task.id"></div>
          <v-btn x-small elevation="8" color=primary :href="`https://maps.google.com/?q=${task.location.latitude},${task.location.longitude}`" target="_blank">
            See on map
          </v-btn>
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
import { mapState, mapMutations, mapGetters } from 'vuex'

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
    alerts: {
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
    ...mapState('alerts-app', ['labels']),
    ...mapGetters('alerts-app', ['incompleteAlerts', 'myAlerts']),
    visibleAlerts() {

      if (!this.filter) return this.alerts

      return this.alerts.filter((t) => {
        return Boolean(Object.values(t).filter((prop) => typeof prop === 'string').find((item) => item.includes(this.filter)))
      })
    }
  },
  methods: {
    ...mapMutations('alerts-app', {
      setComplete: 'alertsCompleted',
      setIncomplete: 'alertsIncomplete',
      deleteTask: 'deleteAlerts'
    }),
    getLabelColor(id) {
      const label = this.labels.find((l) => l.id === id)

      return label ? label.color : ''
    },
    getLabelTitle(id) {
      const label = this.labels.find((l) => l.id === id)

      return label ? label.title : ''
    }
  },
  mounted() {
// I'm text inside the component.
  }
}
</script>

<style lang="scss" scoped>
.alerts-filter {
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
