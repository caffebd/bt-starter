<template>
  <alerts-list :alerts="labelTasks" @edit-task="$emit('edit-alerts', $event)" />
</template>

<script>
import { mapState } from 'vuex'
import AlertsList from '../components/AlertsList'

export default {
  components: {
    AlertsList
  },
  computed: {
    ...mapState('alerts-app', ['alerts']),
    labelTasks() {
      return this.alerts
        .filter((t) => t.labels.indexOf(this.$route.params.id) !== -1)
        .sort((a, b) => a === false ? 1 : -1)
    }
  }
}
</script>
