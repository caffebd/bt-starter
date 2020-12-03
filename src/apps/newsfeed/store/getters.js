/*
|---------------------------------------------------------------------
| TODO Vuex Getters
|---------------------------------------------------------------------
*/
export default {
  incompleteNewsfeed({ newsfeed }) {
    return newsfeed.filter((t) => !t.completed)
  },
  completeNewsfeed({ newsfeed }) {
    return newsfeed.filter((t) => t.completed)
  }
}
