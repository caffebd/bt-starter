/*
|---------------------------------------------------------------------
| TODO Vuex Mutations
|---------------------------------------------------------------------
*/
export default {
  addTask: (state, task) => {
    state.tasks.push({
      //id: task.id,
      ...task,
      completed: false
    })
    state.tasks.sort((a, b) => (a.sortDate < b.sortDate) ? 1 : -1)
  },
  clearTasks: (state) => {
    state.tasks = []
  },
  updateTask: (state, task) => {

    console.log('update ' + task.id)

    const taskIdx = state.tasks.find((t) => t.id === task.id)

    console.log(taskIdx)

    Object.assign(taskIdx, task)
  },
  taskCompleted: (state, task) => {

    const taskIdx = state.tasks.findIndex((t) => t.id === task.id)

    state.tasks[taskIdx].completed = true
  },
  taskIncomplete: (state, task) => {
    const taskIdx = state.tasks.findIndex((t) => t.id === task.id)

    state.tasks[taskIdx].completed = false
  },
  deleteTask: (state, taskId) => {
    console.log('DELETE ' + taskId)

    const taskIdx = state.tasks.findIndex((t) => t.id === taskId)

    if (taskIdx !== -1) state.tasks.splice(taskIdx, 1)
  }
}
