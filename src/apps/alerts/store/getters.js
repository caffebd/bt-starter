/*
|---------------------------------------------------------------------
| TODO Vuex Getters
|---------------------------------------------------------------------
*/
export default {
  incompleteAlerts({ alerts }) {
    return alerts.filter((t) => !t.completed)
  },
  completeAlerts({ alerts }) {
    return alerts.filter((t) => t.completed)
  },
  myAlerts({ alerts }) {
    return alerts
  }

}
