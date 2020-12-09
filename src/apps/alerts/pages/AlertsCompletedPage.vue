<template>
  <alerts-list :alerts="completeAlerts" @edit-task="$emit('edit-alerts', $event)" />
</template>

<script>
import { mapGetters } from 'vuex'
import AlertsList from '../components/AlertsList'

export default {
  components: {
    AlertsList
  },
  computed: {
    ...mapGetters('alerts-app', ['completeAlerts'])
  }
}
</script>
