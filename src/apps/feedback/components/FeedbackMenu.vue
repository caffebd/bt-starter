<template>
  <div>
    <!-- <v-btn
      block
      large
      color="primary"
      class="mb-3"
      @click="$emit('open-compose')"
    >{{ $t('feedback.addTask') }}</v-btn> -->

    <v-list nav class="mt-2 pa-0">
      <v-list-item to="/apps/feedback/feedback" active-class="primary--text" link>
        <v-list-item-icon>
          <v-icon small>mdi-checkbox-marked-circle-outline</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('appfeedback.feedback') }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action v-if="incompleteTasks.length > 0">
          <v-badge inline color="primary" class="font-weight-bold" :content="incompleteTasks.length">
          </v-badge>
        </v-list-item-action>
      </v-list-item>

      <v-list-item to="/apps/feedback/completed" active-class="primary--text" link>
        <v-list-item-icon>
          <v-icon small>mdi-check</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t('appfeedback.completed') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list dense nav class="mt-2 pa-0">
      <div class="overline pa-1 mt-2">{{ $t('feedback.labels') }}</div>

      <v-list-item
        v-for="label in labels"
        :key="label.id"
        :to="`/apps/feedback/label/${label.id}`"
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
    ...mapState('feedback-app', ['labels']),
    ...mapGetters('feedback-app', ['incompleteTasks'])
  }
}
</script>
