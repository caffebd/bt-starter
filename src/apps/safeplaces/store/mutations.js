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

    console.log(taskIdx+'  '+safeplaces.id)

    if (taskIdx !== -1) state.safeplaces.splice(taskIdx, 1)

    console.log(safeplaces.id)

    if (safeplaces.images.length > 0) {

      for (let i = 0; i < safeplaces.images.length; i++) {

        var name = safeplaces.images[i].slice(54, safeplaces.images[i].length);

        const AWSBucketF = require("s3-bucket-toolkit");

        const bucket = new AWSBucketF({
          accessKeyId: "",
          secretAccessKey: "",
          region: "ap-southeast-1",
          bucketACL: "public-read",
          bucketName: "bt-safeplaces",
          pagingDelay: 500, // (optional) set a global delay in between s3 api calls, default: 500ms
        });

      bucket
        .deleteFiles({
          files: [name],
        })
        .then(function (res) {
          /* res.Deleted => Deleted contents */
          console.log(res);
        })
        .catch(function (err) {
          /* err */
        });

      }

    }

    db.collection("safeplaces")
        .doc("dhaka")
        .collection(safeplaces.category)
        .doc(safeplaces.id)
        .delete().then(function () {
      console.log('Document successfully deleted!')
    }).catch(function (error) {
      console.error('Error removing document: ', error)
    })

  }
  // deleteSafeplaces: (state, safeplaces) => {

  //   const taskIdx = state.safeplaces.findIndex((t) => t.id === safeplaces.id)

  //   if (taskIdx !== -1) state.safeplaces.splice(taskIdx, 1)

  //   if (safeplaces.image !== '') {

  //     const myimage = firebase.storage().refFromURL(safeplaces.image)

  //     myimage
  //       .delete()
  //       .then(function () {
  //         console.log('image deleted')
  //       })
  //       .catch(function (error) {
  //         // Uh-oh, an error occurred!
  //         console.log('an error occurred')
  //       })

  //   }

  //   db.collection('safeplaces').doc(safeplaces.id).delete().then(function () {
  //     console.log('Document successfully deleted!')
  //   }).catch(function (error) {
  //     console.error('Error removing document: ', error)
  //   })

  // }
}
