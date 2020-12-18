/*
|---------------------------------------------------------------------
| TODO Vuex Mutations
|---------------------------------------------------------------------
*/
import { db } from '../../../main'
import firebase from 'firebase'
export default {
  addSafeplaces: (state, safeplaces) => {
    //console.log('*******' + task.id)
    state.safeplaces.push({
      id: '_' + safeplaces.id,//Math.random().toString(36).substr(2, 9),
      ...safeplaces
    })
    state.safeplaces.sort((a, b) => (a.sortDate < b.sortDate) ? 1 : -1)
  },
  clearSafeplaces: (state) => {
    state.safeplaces = []
  },
  updateSafeplaces: (state, safeplaces) => {
    const taskIdx = state.safeplaces.find((t) => t.id === safeplaces.id)

    Object.assign(taskIdx, safeplaces)
  },
  safeplacesCompleted: (state, safeplaces) => {
    const taskIdx = state.safeplaces.findIndex((t) => t.id === safeplaces.id)

    state.safeplaces[taskIdx].completed = true
  },
  safeplacesIncomplete: (state, safeplaces) => {
    const taskIdx = state.safeplaces.findIndex((t) => t.id === safeplaces.id)

    state.safeplaces[taskIdx].completed = false
  },
  deleteSafeplacesRemote: (state, safeplaces) => {
    const taskIdx = state.safeplaces.findIndex((t) => t.id === safeplaces.id)

    if (taskIdx !== -1) state.safeplaces.splice(taskIdx, 1)
  },
  deleteSafeplaces: (state, safeplaces) => {

    const taskIdx = state.safeplaces.findIndex((t) => t.id === safeplaces.id)

    if (taskIdx !== -1) state.safeplaces.splice(taskIdx, 1)

    if (safeplaces.image !== '') {

      const myimage = firebase.storage().refFromURL(safeplaces.image)

      myimage
        .delete()
        .then(function () {
          console.log('image deleted')
        })
        .catch(function (error) {
          // Uh-oh, an error occurred!
          console.log('an error occurred')
        })

    }

    db.collection('safeplaces').doc(safeplaces.id).delete().then(function () {
      console.log('Document successfully deleted!')
    }).catch(function (error) {
      console.error('Error removing document: ', error)
    })

  }
}
