<template>
  <reports-list :reports="labelReports" @edit-reports="$emit('edit-reports', $event)" />
</template>

<script>
import { mapState } from 'vuex'
import ReportsList from '../components/ReportsList'

export default {
  components: {
    ReportsList
  },
  computed: {
    ...mapState('reports-app', ['reports']),
    labelReports() {
      return this.reports
        .filter((t) => t.labels.indexOf(this.$route.params.id) !== -1)
        .sort((a, b) => a === false ? 1 : -1)
    }
  }
}
</script>
