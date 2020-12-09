/*
|---------------------------------------------------------------------
| TODO Vuex Mutations
|---------------------------------------------------------------------
*/
import { db } from '../../../main'
import firebase from 'firebase'
export default {
  addNewsfeed: (state, newsfeed) => {
    //console.log('*******' + task.id)
    state.newsfeed.push({
      id: '_' + newsfeed.id,//Math.random().toString(36).substr(2, 9),
      ...newsfeed
    })
    state.newsfeed.sort((a, b) => (a.sortDate < b.sortDate) ? 1 : -1)
  },
  clearNewsfeed: (state) => {
    state.newsfeed = []
  },
  updateNewsfeed: (state, newsfeed) => {
    const taskIdx = state.newsfeed.find((t) => t.id === newsfeed.id)

    Object.assign(taskIdx, newsfeed)
  },
  newsfeedCompleted: (state, newsfeed) => {
    const taskIdx = state.newsfeed.findIndex((t) => t.id === newsfeed.id)

    state.newsfeed[taskIdx].completed = true
  },
  newsfeedIncomplete: (state, newsfeed) => {
    const taskIdx = state.newsfeed.findIndex((t) => t.id === newsfeed.id)

    state.newsfeed[taskIdx].completed = false
  },
  deleteNewsfeedRemote: (state, newsfeed) => {
    const taskIdx = state.newsfeed.findIndex((t) => t.id === newsfeed.id)

    if (taskIdx !== -1) state.newsfeed.splice(taskIdx, 1)
  },
  deleteNewsfeed: (state, newsfeed) => {

    const taskIdx = state.newsfeed.findIndex((t) => t.id === newsfeed.id)

    if (taskIdx !== -1) state.newsfeed.splice(taskIdx, 1)

    console.log(newsfeed.id)

    if (newsfeed.image !== '') {

      const myimage = firebase.storage().refFromURL(newsfeed.image)

      myimage
        .delete()
        .then(function() {
          console.log('image deleted')
        })
        .catch(function(error) {
        // Uh-oh, an error occurred!
          console.log('an error occurred')
        })

    }

    db.collection('newsfeed').doc(newsfeed.id).delete().then(function () {
      console.log('Document successfully deleted!')
    }).catch(function (error) {
      console.error('Error removing document: ', error)
    })

  }
}
