//import { firestoreAction } from "vuexfire";
import { db } from '../../../main'
//import firebase from 'firebase';


const namespaced = true;

const state = {
  id: null,
  name: null,
  email: null,
  partnerId: null,
  movieApiPage: 1,
  matches: [],
  dates: [],
  newChallengeData: [],
  newChallengeSMSData: [],
  newSecretData: [],
  newSecretSMSData: [],
  newTimerData: [],
  newTimerSMSData: [],
  newZoneData: [],
  newZoneSMSData: [],
  newUserSMSData: [],
  newAlarmData: [],
  newBarChartData: [
  {
      name: 'Challenge',
      data: [10, 7, 10, 8, 3]
    }, {
      name: 'Secret',
      data: [0, 0, 10, 8, 3]
    }, {
      name: 'Alarm',
      data: [5, 4, 3, 2, 4]
    }
  ],
  markers: [{
        position: {
          lat: 23.8103,
          lng: 90.4125
        },
        infoText: '<strong>MAPPY</strong>'


      }, {
        position: {
          lat: 23.8203,
          lng: 90.4225
        },
        infoText: '<strong>MAPPY 2</strong>'
      }, {
        position: {
          lat: 47.379592,
          lng: 8.549867
        },
        infoText: '<strong>Marker 3</strong>'
      }],
  pieChartValues:
    [
    { value: 100, name: 'Bloggy Referral' },
    { value: 100, name: 'Newsletter Users' },
    { value: 100, name: 'Email Forwarding' },
    { value: 100, name: 'Referral links' },
    { value: 100, name: 'Eating pie' }
    ]
};

const mutations = {
  SET_USER_DATA: (state, payload) => {
    state.id = payload.id;
    state.name = payload.name;
    state.email = payload.email;
    state.partnerId = payload.partnerId;
    state.movieApiPage = payload.movieApiPage;
  },
  CLEAR_USER_DATA: (state) => {
    state.id = null;
    state.name = null;
    state.email = null;
    state.partnerId = null;
    state.movieApiPage = 1;
    state.matches = [];
  },
  SET_PARTNER_ID: (state, payload) => {
    state.partnerId = payload;
  },
  SET_MOVIE_API_PAGE: (state, payload) => {
    state.movieApiPage = payload;
  },

  SET_MATCHES: (state, payload) => {
    state.matches = payload;
  },

  SET_DATES: (state, payload) => {
    state.dates = payload;
  },

  SET_NEW_CHALLENGEDATA: (state, payload) => {
    state.newChallengeData = payload
  },

  SET_NEW_CHALLENGE_SMS_DATA: (state, payload) => {
    state.newChallengeSMSData = payload
    },

  SET_NEW_SECRETDATA: (state, payload) => {
    state.newSecretData = payload
  },
  SET_NEW_SECRET_SMS_DATA: (state, payload) => {
    state.newSecretSMSData = payload
  },
  SET_NEW_TIMERDATA: (state, payload) => {
    state.newTimerData = payload
  },
  SET_NEW_TIMER_SMS_DATA: (state, payload) => {
    state.newTimerSMSData = payload
  },
  SET_NEW_ZONEDATA: (state, payload) => {
    state.newZoneData = payload
  },
  SET_NEW_ZONE_SMS_DATA: (state, payload) => {
    state.newZoneSMSData = payload
  },
  SET_NEW_USER_SMS_DATA: (state, payload) => {
    state.newUserSMSData = payload
  },
  SET_ALARMDATA: (state, payload) => {
    state.newAlarmData = payload
  },

  SET_NEW_BAR_CHART_DATA: (state, payload) => {
    state.newBarChartData = payload
  },

  SET_NEW_MAP_DATA: (state, payload) => {
    state.markers = payload
  },
  SET_NEW_PIE_DATA: (state, payload) => {
    state.pieChartValues = payload
  },
};

const actions = {
  setUserData(context, userData) {
    context.commit("SET_USER_DATA", userData);
  },
  clearUserData(context, userData) {
    context.commit("CLEAR_USER_DATA", userData);
  },
  setPartnerId(context, id) {
    context.commit("SET_PARTNER_ID", id);
  },
  setMovieApiPage(context, pageNo) {
    context.commit("SET_MOVIE_API_PAGE", pageNo);
  },
  setNewChallengeData(context, data) {
    context.commit('SET_NEW_CHALLENGEDATA', data)
  },

  setNewChallengeSMSData(context, data) {
    context.commit('SET_NEW_CHALLENGE_SMS_DATA', data)
  },

  setNewSecretData(context, data) {
    context.commit('SET_NEW_SECRETDATA', data)
  },

  setNewSecretSMSData(context, data) {
    context.commit('SET_NEW_SECRET_SMS_DATA', data)
  },

  setNewTimerData(context, data) {
    context.commit('SET_NEW_TIMERDATA', data)
  },

  setNewTimerSMSData(context, data) {
    context.commit('SET_NEW_TIMER_SMS_DATA', data)
  },

  setNewZoneData(context, data) {
    context.commit('SET_NEW_ZONEDATA', data)
  },

  setNewZoneSMSData(context, data) {
    context.commit('SET_NEW_ZONE_SMS_DATA', data)
  },

  setNewUserSMSData(context, data) {
    context.commit('SET_NEW_USER_SMS_DATA', data)
  },

  setNewAlarmData(context, data) {
    context.commit('SET_NEW_ALARMDATA', data)
  },

  setNewBarChartData(context, data) {
    context.commit('SET_NEW_BAR_CHART_DATA', data)
  },

  setNewMapData(context, data) {
    context.commit('SET_NEW_MAP_DATA', data)
  },

  async setDates(context, dates) {
    const useDates = dates
    context.commit("SET_DATES", useDates)
  },
  async setPieData(context, pieData) {
    context.commit("SET_NEW_PIE_DATA", pieData)
  },

  async setMatches(context, dates) {

    console.log (Date.parse(dates[0]))


    console.log(Date.parse('2020-11-20 00:00:00.000'));



    let testCollection=[];
    //context.commit("SET_MATCHES", categories)
    db.collection('users').doc(context.state.id)
      .collection("events")
      .orderBy('createdAt').startAt(Date.parse(dates[0])).endAt(Date.parse(dates[1]))
      // .where('createdAt'
      //   , '==', Date.parse('2020-11-17 00:00:00.000'))
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          // eslint-disable-next-line no-console
          console.log('cannot find')
          //this.$router.push('/HelloWorld')
        } else {

                querySnapshot.forEach(doc =>{
                    var coll=[];
                  var id = doc.id;
                    doc.data()['events'].forEach(doc=>{
                      coll.push({ doc });


                    }),
                    testCollection.push({[id]: coll});

                })

                console.log(testCollection)

          context.commit("SET_MATCHES", testCollection)

        }
      })


  },

}


const getters = {};

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters,
};
