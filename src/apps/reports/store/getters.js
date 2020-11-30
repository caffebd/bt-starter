/*
|---------------------------------------------------------------------
| TODO Vuex Getters
|---------------------------------------------------------------------
*/
export default {
  incompleteReports({ reports }) {
    return reports.filter((t) => !t.completed)
  },
  completeReports({ reports }) {
    return reports.filter((t) => t.completed)
  }
}
