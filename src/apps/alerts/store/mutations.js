/*
|---------------------------------------------------------------------
| TODO Vuex Mutations
|---------------------------------------------------------------------
*/
export default {
  addAlerts: (state, alerts) => {
    state.alerts.push({
      //id: task.id,
      ...alerts,
      completed: false
    })

    state.alerts.sort((a, b) => (a.sortDate < b.sortDate) ? 1 : -1)
  },
  clearAlerts: (state) => {
    state.alerts = []
  },
  updateAlerts: (state, alerts) => {

    console.log('update ' + alerts.id)

    const taskIdx = state.alerts.find((t) => t.id === alerts.id)

    console.log(taskIdx)

    Object.assign(taskIdx, alerts)
  },
  alertsCompleted: (state, alerts) => {

    const taskIdx = state.alerts.findIndex((t) => t.id === alerts.id)

    state.alerts[taskIdx].completed = true
  },
  alertsIncomplete: (state, alerts) => {
    const taskIdx = state.alerts.findIndex((t) => t.id === alerts.id)

    state.alerts[taskIdx].completed = false
  },
  deleteAlerts: (state, taskId) => {
    console.log('DELETE ' + taskId)

    const taskIdx = state.alerts.findIndex((t) => t.id === taskId)

    if (taskIdx !== -1) state.alerts.splice(taskIdx, 1)
  }
}
