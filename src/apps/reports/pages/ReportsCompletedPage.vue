<template>
  <reports-list :reports="completeReports" @edit-reports="$emit('edit-reports', $event)" />
</template>

<script>
import { mapGetters } from 'vuex'
import ReportsList from '../components/ReportsList'

export default {
  components: {
    ReportsList
  },
  computed: {
    ...mapGetters('reports-app', ['completeReports'])
  }
}
</script>
