<template>
  <reports-list :reports="incompleteReports" @edit-reports="$emit('edit-reports', $event)" />
</template>

<script>
import { mapGetters } from 'vuex'
import ReportsList from '../components/ReportsList'

export default {
  components: {
    ReportsList
  },
  computed: {
    ...mapGetters('reports-app', ['incompleteReports'])
  }
}
</script>
