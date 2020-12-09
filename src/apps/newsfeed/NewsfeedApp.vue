<template>
  <div class="d-flex flex-grow-1 flex-row mt-2 ml-4">
    <v-navigation-drawer
      v-model="drawer"
      :app="$vuetify.breakpoint.mdAndDown"
      :permanent="$vuetify.breakpoint.lgAndUp"
      floating
      class="elevation-1 rounded flex-shrink-0"
      :right="$vuetify.rtl"
      :class="[$vuetify.rtl ? 'ml-3' : 'mr-3']"
      width="340"
    >
      <newsfeed-menu
        class="newsfeed-app-menu pa-2"
        @open-compose="openCompose"
      ></newsfeed-menu>
    </v-navigation-drawer>

    <div class="d-flex flex-grow-1 flex-column">
      <v-toolbar class="hidden-lg-and-up flex-grow-0 mb-2">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="title font-weight-bold">Newsfeed App</div>
      </v-toolbar>
      <router-view
        :key="$route.fullPath"
        class="flex-grow-1"
        @edit-newsfeed="openCompose"
      ></router-view>
    </div>

    <newsfeed-compose ref="compose" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import NewsfeedMenu from "./components/NewsfeedMenu";
import NewsfeedCompose from "./components/NewsfeedCompose";

/*
|---------------------------------------------------------------------
| NEWSFEED Application Component
|---------------------------------------------------------------------
|
| Application layout
|
*/
import { mapState, mapMutations } from "vuex";
import { db } from "../../main";
import moment from "moment";

export default {
  components: {
    NewsfeedMenu,
    NewsfeedCompose
  },
  data() {
    return {
      drawer: null,
      newsfeed: []
    };
  },
  created() {
    var tempHolder = [];
    this.clearNewsfeed();
    this.$store.state.user.viewingAlerts = false;
    db.collection("newsfeed").onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc;

        console.log(doc.data()["title"]);

        var sortTime = doc.data().time.seconds * 1000;
        var myDate = moment(sortTime).format("MMM Do YY");
        //console.log (myDate)

        var setLabel = [doc.data()["cat"]];
        console.log(doc.data()["likes"]);

        if (change.type == "removed") {
          const dTask = {
            id: doc.id
          };

          this.deleteNewsfeedRemote(dTask);
        } else if (change.type == "modified") {
          const aTask = {
            sortDate: sortTime,
            id: doc.id,
            title: doc.data()["title"],
            article: doc.data()["article"],
            author: doc.data()["author"],
            show: doc.data()["show"],
            likes: doc.data()["likes"],
            shares: doc.data()["shares"],
            time: doc.data()["time"],
            category: doc.data()["cat"],
            labels: [doc.data()["cat"]],
            image: doc.data()["image"],
            show: doc.data()["show"],
            completed: doc.data()["completed"] ?? false
          };
          this.updateNewsfeed(aTask);
        } else {
          const aTask = {
            sortDate: sortTime,
            id: doc.id,
            title: doc.data()["title"],
            article: doc.data()["article"],
            author: doc.data()["author"],
            show: doc.data()["show"],
            likes: doc.data()["likes"],
            shares: doc.data()["shares"],
            time: doc.data()["time"],
            category: doc.data()["cat"],
            labels: [doc.data()["cat"]],
            image: doc.data()["image"],
            show: doc.data()["show"],
            completed: doc.data()["completed"] ?? false
          };
          this.addNewsfeed(aTask);
        }
      });
      //console.log(tempHolder)
      // tempHolder.sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
      // for (var i = 0; i < tempHolder.length; i++) {
      //   console.log(tempHolder[i]);
      //   this.addNewsfeed(tempHolder[i]);
      // }
    });

    //this.addTask(tempHolder)
  },
  methods: {
    ...mapMutations("newsfeed-app", [
      "updateNewsfeed",
      "addNewsfeed",
      "clearNewsfeed",
      "deleteNewsfeedRemote"
    ]),
    openCompose(newsfeed) {
      this.$refs.compose.open(newsfeed);
    },
    newsfeedAdding() {
      this.addNewsfeed(newsfeed);
    }
  }
};
</script>
