/*
|---------------------------------------------------------------------
| TODO Vuex Getters
|---------------------------------------------------------------------
*/
export default {
  incompleteSafeplaces({ safeplaces }) {
    return safeplaces.filter((t) => !t.completed)
  },
  completeSafeplaces({ safeplaces }) {
    return safeplaces.filter((t) => t.completed)
  }
}
