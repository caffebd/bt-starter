<template>
  <alerts-list :alerts="incompleteAlerts" @edit-task="$emit('edit-alerts', $event)" />
</template>

<script>
import { mapGetters } from 'vuex'
import AlertsList from '../components/AlertsList'

export default {
  components: {
    AlertsList
  },
  computed: {
    ...mapGetters('alerts-app', ['incompleteAlerts'])
  }
}
</script>
