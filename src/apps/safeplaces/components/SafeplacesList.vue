<template>
  <v-card class="min-w-0">
    <v-text-field
      v-model="filter"
      class="pa-1 py-2 safeplaces-filter elevation-1"
      placeholder="Filter news"
      prepend-inner-icon="mdi-magnify"
      hide-details
      block
      clearable
      solo
      flat
    ></v-text-field>

    <v-divider></v-divider>

    <div v-if="safeplaces.length === 0">
      <div class="px-1 py-6 text-center">No news</div>
    </div>

    <v-slide-y-transition v-else group tag="div">
      <div
        v-for="(task, z) in visiblesafeplaces"
        :key="z"
        @click="$emit('edit-safeplaces', task)"
        class="d-flex pa-2 task-item align-center"
      >
        <!-- @click="$emit('edit-task', task)" was in above line-->
        <!-- <v-checkbox
          :input-value="task.completed"
          class="mt-0 pt-0"
          hide-details
          off-icon="mdi-checkbox-blank-circle-outline"
          on-icon="mdi-checkbox-marked-circle"
          @click.stop="task.completed ? setIncomplete(task) : setComplete(task)"
        ></v-checkbox> -->

        <div
          class="task-item-content flex-grow-1"
          :class="{ complete: task.completed }"
        >
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
          <div>
            <p>Name: {{ task.nameEN }}</p>
          </div>
          <div>
            <p>Type: {{ task.typeEN }}</p>
          </div>
          <div>
            <p>Location: {{ task.locationDescEN }}</p>
          </div>
          <div>
            <p>Lat / Long: {{ task.location }}</p>
          </div>
          <div>
            <p>Phone: {{ task.phone }}</p>
          </div>
          <div>
            <p>Web: {{ task.website }}</p>
          </div>
          <div>
            <p>Social: {{ task.social }}</p>
          </div>
          <div>
            <p>Time: {{ task.time }}</p>
          </div>
          <div>
            <p>Date: {{ readableTime(task.time.seconds * 1000) }}</p>
          </div>
        </div>

        <div
          v-show="$store.state.user.isAdmin"
          class="d-flex align-center"
          <v-btn v-show="$store.state.user.isAdmin" icon @click.stop="beginDelete(task)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </div>
      </div>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from "vuex";

/*
|---------------------------------------------------------------------
| ToDo List Component
|---------------------------------------------------------------------
|
| Task lister
|
*/
import moment from "moment";
export default {
  props: {
    // task list
    safeplaces: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filter: "",
    };
  },
  computed: {
    ...mapState("safeplaces-app", ["safeplaceslabels"]),
    visiblesafeplaces() {
      if (!this.filter)
        return this.safeplaces.sort((a, b) =>
          a.sortDate < b.sortDate ? 1 : -1
        );

      return this.safeplaces.filter((t) => {
        return Boolean(
          Object.values(t)
            .filter((prop) => typeof prop === "string")
            .find((item) =>
              item.toLowerCase().includes(this.filter.toLowerCase())
            )
        );
      });
    },
  },
  methods: {
    ...mapMutations("safeplaces-app", {
      setComplete: "safeplacesCompleted",
      setIncomplete: "safeplacesIncomplete",
      deleteSafeplaces: "deleteSafeplaces",
    }),
    readableTime(seconds) {
      return moment(new Date(seconds)).format("Do MMM YY -- H:m");
    },
    getLabelColor(id) {
      const label = this.safeplaceslabels.find((l) => l.id === id);

      return label ? label.color : "";
    },
    getLabelTitle(id) {
      const label = this.safeplaceslabels.find((l) => l.id === id);

      return label ? label.title : "";
    },
    beginDelete(task) {
      console.log(this.$store.state.user.isAdmin);
      if (this.$store.state.user.isAdmin) {
        this.deleteSafeplaces(task);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.safeplaces-filter {
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
