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
      <safeplaces-menu
        class="safeplaces-app-menu pa-2"
        @open-compose="openCompose"
      ></safeplaces-menu>
    </v-navigation-drawer>

    <div class="d-flex flex-grow-1 flex-column">
      <v-toolbar class="hidden-lg-and-up flex-grow-0 mb-2">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="title font-weight-bold">Safeplaces App</div>
      </v-toolbar>
      <router-view
        :key="$route.fullPath"
        class="flex-grow-1"
        @edit-safeplaces="openCompose"
      ></router-view>
    </div>

    <safeplaces-compose ref="compose" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import SafeplacesMenu from "./components/SafeplacesMenu";
import SafeplacesCompose from "./components/SafeplacesCompose";

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
    SafeplacesMenu,
    SafeplacesCompose,
  },
  data() {
    return {
      drawer: null,
      safeplaces: [],
    };
  },
  created() {
    var tempHolder = [];
    this.clearSafeplaces();
    this.$store.state.user.viewingAlerts = false;

    let allTheItems = [
      db.collection("safeplaces").doc("dhaka").collection("shop"),
      db.collection("safeplaces").doc("dhaka").collection("pharmacy"),
      db.collection("safeplaces").doc("dhaka").collection("food"),
      db.collection("safeplaces").doc("dhaka").collection("doctor"),
      db.collection("safeplaces").doc("dhaka").collection("gym"),
      db.collection("safeplaces").doc("dhaka").collection("toilet"),
      db.collection("safeplaces").doc("dhaka").collection("beauty"),
      db.collection("safeplaces").doc("dhaka").collection("club"),
    ];

    for (var a = 0; a < allTheItems.length; a++) {
      allTheItems[a].onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let doc = change.doc;

          var sortTime = doc.data().time.seconds * 1000;
          var myDate = moment(sortTime).format("MMM Do YY");
          //console.log (myDate)

          var setLabel = [doc.data()["cat"]];

          if (change.type == "typeEN") {
            const dTask = {
              id: doc.id,
            };

            this.deleteSafeplacesRemote(dTask);
          } else if (change.type == "modified") {
            const aTask = {
              sortDate: sortTime,
              id: doc.id,
              nameEN: doc.data()["nameEN"],
              nameBN: doc.data()["nameBN"],
              phone: doc.data()["phone"],
              price: doc.data()["price"],
              raters: doc.data()["raters"],
              reports: doc.data()["reports"],
              social: doc.data()["social"],
              time: doc.data()["time"],
              typeBN: doc.data()["typeBN"],
              typeEN: doc.data()["typeEN"],
              website: doc.data()["website"],
              category: doc.data()["category"],
              detailsEN: doc.data()["detailsEN"],
              detailsBN: doc.data()["detailsBN"],
              facilitiesEN: doc.data()["facilitiesEN"],
              facilitiesBN: doc.data()["facilitiesBN"],
              images: doc.data()["images"],
              labels: [doc.data()["category"]],
              locationDescBN: doc.data()["locationDescBN"],
              locationDescEN: doc.data()["locationDescEN"],
              location: doc.data()["location"],
              completed: doc.data()["completed"] ?? false,
            };
            this.updateSafeplaces(aTask);
          } else {
            const aTask = {
              sortDate: sortTime,
              id: doc.id,
              nameEN: doc.data()["nameEN"],
              nameBN: doc.data()["nameBN"],
              phone: doc.data()["phone"],
              price: doc.data()["price"],
              raters: doc.data()["raters"],
              reports: doc.data()["reports"],
              social: doc.data()["social"],
              time: doc.data()["time"],
              typeBN: doc.data()["typeBN"],
              typeEN: doc.data()["typeEN"],
              website: doc.data()["website"],
              category: doc.data()["category"],
              detailsEN: doc.data()["detailsEN"],
              detailsBN: doc.data()["detailsBN"],
              facilitiesEN: doc.data()["facilitiesEN"],
              facilitiesBN: doc.data()["facilitiesBN"],
              images: doc.data()["images"],
              labels: [doc.data()["category"]],
              locationDescBN: doc.data()["locationDescBN"],
              locationDescEN: doc.data()["locationDescEN"],
              location: doc.data()["location"],
              completed: doc.data()["completed"] ?? false,
            };
            this.addSafeplaces(aTask);
          }
        });
        //console.log(tempHolder)
        // tempHolder.sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
        // for (var i = 0; i < tempHolder.length; i++) {
        //   console.log(tempHolder[i]);
        //   this.addNewsfeed(tempHolder[i]);
        // }
      });
    }
    //this.addTask(tempHolder)
  },
  methods: {
    ...mapMutations("safeplaces-app", [
      "updateSafeplaces",
      "addSafeplaces",
      "clearSafeplaces",
      "deleteSafeplacesRemote",
    ]),
    openCompose(safeplaces) {
      this.$refs.compose.open(safeplaces);
    },
    safeplacesAdding() {
      this.addSafeplaces(safeplaces);
    },
  },
};
</script>
