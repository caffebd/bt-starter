/*
|---------------------------------------------------------------------
| TODO Vuex Mutations
|---------------------------------------------------------------------
*/
export default {
  addReports: (state, reports) => {
    //console.log('*******' + task.id)
    state.reports.push({
      id: '_' + reports.id,//Math.random().toString(36).substr(2, 9),
      ...reports,
      completed: false
    })
  },
  clearReports: (state) => {
    state.reports = []
  },
  updateReports: (state, reports) => {
    const taskIdx = state.reports.find((t) => t.id === reports.id)

    Object.assign(taskIdx, reports)
  },
  reportsCompleted: (state, reports) => {
    const taskIdx = state.reports.findIndex((t) => t.id === reports.id)

    state.reports[taskIdx].completed = true
  },
  reportsIncomplete: (state, reports) => {
    const taskIdx = state.reports.findIndex((t) => t.id === reports.id)

    state.reports[taskIdx].completed = false
  },
  deleteReports: (state, reports) => {
    const taskIdx = state.reports.findIndex((t) => t.id === reports.id)

    if (taskIdx !== -1) state.reports.splice(taskIdx, 1)
  }
}
