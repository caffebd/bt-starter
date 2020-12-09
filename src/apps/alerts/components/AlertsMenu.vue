<template>
  <div>
    <!-- <v-btn
      block
      large
      color="primary"
      class="mb-3"
      @click="$emit('open-compose')"
    >{{ $t('todo.addTask') }}</v-btn> -->

    <v-list nav class="mt-2 pa-0">
      <v-list-item to="/apps/alerts/alerts" active-class="primary--text" link>
        <v-list-item-icon>
          <v-icon small>mdi-checkbox-marked-circle-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('appalerts.alerts') }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action v-if="incompleteAlerts.length > 0">
          <v-badge inline color="primary" class="font-weight-bold" :content="incompleteAlerts.length">
          </v-badge>
        </v-list-item-action>
      </v-list-item>

      <v-list-item to="/apps/alerts/completed" active-class="primary--text" link>
        <v-list-item-icon>
          <v-icon small>mdi-check</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('appalerts.completed') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list dense nav class="mt-2 pa-0">
      <div class="overline pa-1 mt-2">{{ $t('appalerts.labels') }}</div>

      <v-list-item
        v-for="label in labels"
        :key="label.id"
        :to="`/apps/alerts/label/${label.id}`"
        exact
        active-class="primary--text"
        link
      >
        <v-list-item-icon>
          <v-icon small :color="label.color">mdi-label-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ label.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

/*
|---------------------------------------------------------------------
| TODO Menu Component
|---------------------------------------------------------------------
|
| TODO application navigation
|
*/
export default {
  computed: {
    ...mapState('alerts-app', ['labels']),
    ...mapGetters('alerts-app', ['incompleteAlerts'])
  }
}
</script>
