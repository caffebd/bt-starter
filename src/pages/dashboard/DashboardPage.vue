<template>
  <div class="d-flex flex-grow-1 flex-column">
  <!-- Tabs -->
    <v-card>
      <v-tabs
        v-model="tabs"
        centered
        color="blue"
      >
        <v-tab
          v-for="i in 2"
          :key="i"
          @change="dateChangedChecker(i)"
          class="px-5 py-2"
        >
        <v-icon left>mdi-chart-arc</v-icon>  {{ chartTabs[i] }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-row class="flex-grow-0" dense>
            <v-col cols="12">
              <column-card
                class="h-full"
                style="min-height: 380px"
                :value="1837.32"
                :percentage="3.2"
                :loading="isLoading1"
                :percentage-label="$t('dashboard.lastweek')"
                :action-label="$t('dashboard.viewReport')"
              ></column-card>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
            <v-row class="flex-grow-0" dense>
            <v-col cols="12">
              <pie-card
                class="h-full"
                style="min-height: 380px"
                :value="1837.32"
                :percentage="3.2"
                :loading="isLoading1"
                :percentage-label="$t('dashboard.lastweek')"
                :action-label="$t('dashboard.viewReport')"
              ></pie-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <!-- Real/Research Data Selection-->

       <v-card class="grey lighten-5 mt-2">
      <v-container>
        <v-row>
          <!-- Group Switch -->
          <v-col cols="3" class="title cyan lighten-4 white--text">
              <v-switch
              class="ml-4"
              inset
              v-model="useRealData"
              color="red"
              :label="`Data Mode: ${dataSource.toString()}`"
              @change="toggleDataType($event)"
              ></v-switch>
          </v-col>
        </v-row>
      </v-container>
     </v-card>

    <!-- Group/Individual or Event Selection-->
    <v-card class="grey lighten-5 mt-2">
      <v-container>
        <v-row>
          <!-- Group Switch -->
          <v-col cols="3" class="title cyan lighten-4 white--text">
              <v-switch
              class="ml-4"
              inset
              v-model="mode"
              color="red"
              :label="`Mode: ${chartType.toString()}`"
              @change="toggleChartType($event)"
              ></v-switch>
          </v-col>

          <!-- Date Selection -->
          <v-col cols="3" class="deep-purple lighten-4 white--text">
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="dates"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
              <v-text-field
              v-model="dates"
              class="title"
              label="Select Date Range"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              ></v-text-field>
              </template>

              <v-date-picker
                v-model="dates"
                range
              >
                <v-spacer></v-spacer>
                <v-btn
                text
                color="primary"
                @click="modal = false"
                >
                  Cancel
                </v-btn>

                <v-btn
                text
                color="primary"
                @click="$refs.dialog.save(dates); dateChangedChecker(1)"
                >
                OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>

          <!-- Time Range Selection -->
          <v-col cols="3" class="green lighten-4 mt-0 pt-1">
            <v-subheader class="justify-center title">Select time range</v-subheader>
            <v-range-slider
              v-model="timerange"
              :max="timemax"
              :min="timemin"
              hide-details
              class="align-center"
              @change="dateChangedChecker(1)"
            >
            <template v-slot:prepend>
              <v-text-field
                :value="timerange[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px;"
                @change="$set(timerange, 0, $event); dateChangedChecker(1)"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :value="timerange[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(timerange, 1, $event); dateChangedChecker(1)"
              ></v-text-field>
            </template>
          </v-range-slider>
          </v-col>

          <!-- Age Range Selection -->
          <v-col cols="3" v-show="!mode"  class="blue lighten-4 mt-0 pt-1">

            <v-subheader class="justify-center title">Set min and max age</v-subheader>
            <v-range-slider
              v-model="range"
              :max="max"
              :min="min"
              hide-details
              class="align-center"
            >
            <template v-slot:prepend>
              <v-text-field
                :value="range[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(range, 0, $event); dateChangedChecker(1)"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :value="range[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(range, 1, $event); dateChangedChecker(1)"
              ></v-text-field>
            </template>
          </v-range-slider>
          </v-col>


          <!-- Search with Number -->
          <v-col cols="3" v-show="mode" class="blue lighten-4  mb-0 pb-0 pt-4">
            <span class="d-inline-flex">
            <v-text-field
              v-model="email"
              color="title"
              outlined
              label='Enter mobile number'
              type='text'
            ></v-text-field>
            <v-btn
              @click="searchUsersByEmail"
              x-large
              elevation="4"
              class="ml-2"
              color="primary"
            >
            <v-icon left>
              large
              mdi-feature-search-outline
            </v-icon>
              Search
            </v-btn>
            </span>
          </v-col>
        </v-row>

        <!-- Event Selection Real DATA-->

        <v-row v-if="useRealData">
          <v-col cols="6" class="ml-0 px-0 outlined">
            <v-card class="red lighten-5 pb-4 mr-1 px-0">
              <v-card-title class="red lighten-1 justify-center">
                <v-icon
                      left
                      large
                      color="white lighten-2">mdi-alarm-light-outline
                    </v-icon>
                    <span class="headline white--text">SOS</span>
              </v-card-title>
            <v-divider></v-divider>

            <v-row class="flex-grow-0" dense>
              <v-col cols="4">
                <v-checkbox
                  class="px-2 pt-1"
                  v-model="challengeCheck"
                  label="Confront"
                  color="primary"
                  v-on:change="checkBoxTest('challenge')"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  class="px-2"
                  v-model="challengeSMSCheck"
                  label="Confront SMS"
                  color="primary"
                  v-on:change="checkBoxTest('challenge-sms')"
                  hide-details
                ></v-checkbox>
              </v-col>

                <v-col cols="4">
                <v-checkbox
                  class="px-2 pt-1"
                  v-model="userSMSCheck"
                  label="User SMS"
                  color="primary"
                  v-on:change="checkBoxTest('user-sms')"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  class="px-2"
                  v-model="alarmCheck"
                  label="Alarm"
                  color="primary"
                  v-on:change="checkBoxTest('alarm')"
                  hide-details
                ></v-checkbox>
              </v-col>

              <v-col cols="4">
                <v-checkbox
                  class="px-2 pt-1"
                  v-model="secretCheck"
                  label="Secret"
                  color="primary"
                  v-on:change="checkBoxTest('secret')"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  class="px-2"
                  v-model="secretSMSCheck"
                  label="Secret SMS"
                  color="primary"
                  v-on:change="checkBoxTest('secret-sms')"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
            </v-card>
          </v-col>

          <v-col cols="3" class="px-1">
            <v-card class="green lighten-5 pb-4">
              <v-card-title class="green lighten-1 justify-center">
                <v-icon
                      left
                      large
                      color="white darken-2">mdi-road-variant
                    </v-icon>
                    <span class="headline white--text">Travel</span>
              </v-card-title>

              <v-checkbox
                class="px-2 pt-2"
                v-model="zoneCheck"
                label="Zone"
                color="primary"
                v-on:change="checkBoxTest('zone')"
                hide-details
              ></v-checkbox>

              <v-checkbox
                class="px-2"
                v-model="zoneSMSCheck"
                label="Zone SMS"
                color="primary"
                v-on:change="checkBoxTest('zones-sms')"
                hide-details
              ></v-checkbox>
            </v-card>
          </v-col>

          <v-col cols="3" class="px-1">
            <v-card class="amber lighten-5 pb-4">
              <v-card-title class="amber darken-1 justify-center">
                <v-icon
                      left
                      large
                      color="white darken-2">mdi-alarm
                    </v-icon>
                    <span class="headline white--text">Reminder</span>
              </v-card-title>

              <v-checkbox
              class="px-2 pt-2"
              v-model="timerCheck"
              label="Reminder"
              color="primary"
              v-on:change="checkBoxTest('timer')"
              hide-details
            ></v-checkbox>

            <v-checkbox
              class="px-2"
              v-model="timerSMSCheck"
              label="Reminder SMS"
              color="primary"
              v-on:change="checkBoxTest('timer-sms')"
              hide-details
            ></v-checkbox>
            </v-card>
          </v-col>
        </v-row>


   <!-- Event Selection Research DATA-->

        <v-row v-if="useRealData==false">
          <v-col cols="6" class="ml-0 px-0 outlined">
            <v-card class="red lighten-5 pb-4 mr-1 px-0">
              <v-card-title class="red lighten-1 justify-center">
                <v-icon
                      left
                      large
                      color="white lighten-2">mdi-alarm-light-outline
                    </v-icon>
                    <span class="headline white--text">SOS</span>
              </v-card-title>
            <v-divider></v-divider>

            <v-row class="flex-grow-0" dense>
              <v-col cols="4">
                <v-checkbox
                  class="px-2 pt-1"
                  v-model="challengeCheck"
                  label="Confront (R)"
                  color="primary"
                  v-on:change="checkBoxTest('researchChallenge')"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  class="px-2"
                  v-model="challengeSMSCheck"
                  label="Zone (R)"
                  color="primary"
                  v-on:change="checkBoxTest('researchZone')"
                  hide-details
                ></v-checkbox>
              </v-col>

                <v-col cols="4">
                <v-checkbox
                  class="px-2 pt-1"
                  v-model="userSMSCheck"
                  label="User SMS (R)"
                  color="primary"
                  v-on:change="checkBoxTest('researchUserSMS')"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  class="px-2"
                  v-model="alarmCheck"
                  label="Alarm (R)"
                  color="primary"
                  v-on:change="checkBoxTest('researchAlarm')"
                  hide-details
                ></v-checkbox>
              </v-col>

              <v-col cols="4">
                <v-checkbox
                  class="px-2 pt-1"
                  v-model="secretCheck"
                  label="Secret (R)"
                  color="primary"
                  v-on:change="checkBoxTest('researchSecret')"
                  hide-details
                ></v-checkbox>

                <v-checkbox
                  class="px-2"
                  v-model="secretSMSCheck"
                  label="Reminder (R)"
                  color="primary"
                  v-on:change="checkBoxTest('researchTimer')"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
            </v-card>
          </v-col>

          <v-col cols="3" class="px-1">
            <v-card class="green lighten-5 pb-4">
              <v-card-title class="green lighten-1 justify-center">
                <v-icon
                      left
                      large
                      color="white darken-2">mdi-road-variant
                    </v-icon>
                    <span class="headline white--text">Travel</span>
              </v-card-title>

              <v-checkbox
                class="px-2 pt-2"
                v-model="zoneCheck"
                label="App Opened (R)"
                color="primary"
                v-on:change="checkBoxTest('researchAppOpened')"
                hide-details
              ></v-checkbox>

              <v-checkbox
                class="px-2"
                v-model="zoneSMSCheck"
                label="Test Mode On (R)"
                color="primary"
                v-on:change="checkBoxTest('researchTestOn')"
                hide-details
              ></v-checkbox>
            </v-card>
          </v-col>

          <v-col cols="3" class="px-1">
            <v-card class="amber lighten-5 pb-4">
              <v-card-title class="amber darken-1 justify-center">
                <v-icon
                      left
                      large
                      color="white darken-2">mdi-alarm
                    </v-icon>
                    <span class="headline white--text">Reminder</span>
              </v-card-title>

              <v-checkbox
              class="px-2 pt-2"
              v-model="timerCheck"
              label="Use Bangla (R)"
              color="primary"
              v-on:change="checkBoxTest('researchBangla')"
              hide-details
            ></v-checkbox>

            <v-checkbox
              class="px-2"
              v-model="timerSMSCheck"
              label="Use English (R)"
              color="primary"
              v-on:change="checkBoxTest('researchEnglish')"
              hide-details
            ></v-checkbox>
            </v-card>
          </v-col>
        </v-row>


      </v-container>
    </v-card>
  </div>
</template>

<script>

// DEMO Cards for dashboard
//import SalesCard from '../../components/dashboard/InboxCard'
import ColumnCard from '../../pages/ui/charts/_examples/apex-charts/simple/column'
import PieCard from '../../pages/ui/charts/_examples/echarts/pie'
import { db } from '../../main'
import moment from 'moment'
import firebase from 'firebase'
import cardListVue from '../ui/components/_examples/lists/intermediate/card-list.vue'
const query = db.collection('users')

export default {
  components: {
    ColumnCard,
    PieCard
  },
  data() {
    return {
      useRealData:true,
      chartTabs:['na','Bar Chart', 'Pie Chart'],
      timemin: 0,
      timemax: 24,
      timerange: [0, 24],
      max:99,
      min:0,
      tabs:null,
      range:[0,99],
      form: false,
      mode:false,
      chartType:'Group',
      loadingInterval: null,
      email: '',
      foundUser: null,
      isLoading1: true,
      fromDateMenu: false,
      fromDateVal: null,
      dates:[],
      modal: false,
      minDate: '2019-07-04',
      maxDate: '2030-08-30',
      allSearchDates: [],
      allResults: [],
      challengeList:[],
      challengeSMSList:[],
      secretList:[],
      secretSMSList:[],
      timerList:[],
      timerSMSList:[],
      userSMSList:[],
      zoneList:[],
      zoneSMSList:[],
      alarmList:[],
      sendBarData: [],
      sendPieData:[],
      selectChallenge: true,
      selectChallengeSMS:true,
      selectSecret:true,
      selectSecretSMS:false,
      selectTimer:true,
      selectTimerSMS:true,
      selectZone:false,
      selectZoneSMS:false,
      selectUserSMS:true,
      selectAlarm:true,

      groupChallengeCount:0,
      groupChallengeSMSCount:0,
      groupSecretCount:0,
      groupSecretSMSCount:0,
      groupTimerCount:0,
      groupTimerSMSCount:0,
      groupZoneCount:0,
      groupZoneSMSCount:0,
      groupUserSMSCount:0,
      groupAlarmCount:0,

      challengeCheck:false,
      challengeSMSCheck:false,
      secretCheck:false,
      secretSMSCheck:false,
      timerCheck:false,
      timerSMSCheck:false,
      zoneCheck:false,
      zoneSMSCheck:false,
      userSMSCheck:false,
      alarmCheck:false,



      researchChallengeList:[],
      researchAlarmList:[],
      researchAppOpenedList:[],
      researchBanglaList:[],
      researchEnglishList:[],
      researchSecretList:[],
      researchTestOnList:[],
      researchTimerList:[],
      researchUserSMSList:[],
      researchZoneList:[],

      lowerAge:1,
      upperAge:99,

      lowerTime:0,
      upperTime:24,

      activeCheckBoxes:[],

      dataSource:'events',
      dataList:'events'


    }
  },
  mounted() {
    let count = 0

    // DEMO delay for loading graphics
    this.loadingInterval = setInterval(() => {
      this[`isLoading${count++}`] = false
      if (count === 4) this.clear()
    }, 400)
  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    clearAllCriteria(){
      this.challengeList = []
      this.challengeSMSList = []
      this.secretList = []
      this.secretSMSList = []
      this.timerList = []
      this.timerSMSList = []
      this.userSMSList = []
      this.zoneList = []
      this.zoneSMSList = []
      this.alarmList = []

      this.researchChallengeList = [],
      this.researchAlarmList = [],
      this.researchAppOpenedList = [],
      this.researchBanglaList = [],
      this.researchEnglishList = [],
      this.researchSecretList = [],
      this.researchTestOnList = [],
      this.researchTimerList = [],
      this.researchUserSMSList = [],
      this.researchZoneList = [],

      this.sendBarData = []
      this.sendPieData = []

      this.challengeCheck = false
      this.challengeSMSCheck = false
      this.secretCheck = false
      this.secretSMSCheck = false
      this.timerCheck = false
      this.timerSMSCheck = false
      this.zoneCheck = false
      this.zoneSMSCheck = false
      this.userSMSCheck = false
      this.alarmCheck = false

      this.activeCheckBoxes=[]



      this.$store.dispatch('queryuser/setPieData',this.sendPieData)
      this.$store.dispatch('queryuser/setNewBarChartData',Object.values(this.sendBarData))
    },
    toggleDataType(event){

      this.clearAllCriteria()

      if (event==true){
        this.useRealData = true
        this.dataSource = 'events',
        this.dataList = 'events'
      }else{
        this.useRealData = false
        this.dataSource = 'research'
        this.dataList = 'data'
      }


    },
    toggleChartType(event){
      console.log(event)
      this.clearAllCriteria()
      if (event==true){
        this.chartType='Individual'
      }else{
        this.chartType='Group'
      }
    },
    clear() {
      clearInterval(this.loadingInterval)
    },
    checkBoxTest(type){
      console.log(type+' '+this.challengeCheck)
      if (this.activeCheckBoxes.includes(type)) {
        this.activeCheckBoxes.splice(this.activeCheckBoxes.indexOf(type), 1);
      }else{
        this.activeCheckBoxes.push(type)
      }
      console.log (this.activeCheckBoxes)

    if (this.chartType=='Group') {
      this.getGroupData(type, false)
    }else{
      if (this.useRealData){
      this.selectChartColumns()
      }else{
        this.selectResearchChartColumns()
      }
    }

    },
    dateChangedChecker(i) {

      if (i==2){
        return
      }

      this.sendBarData=[]
      this.sendPieData=[]

    if (this.chartType=='Group') {

      for (var d=0; d<this.activeCheckBoxes.length; d++){
        this.getGroupData(this.activeCheckBoxes[d], true)
      }

    }else{
      this.searchUsersByEmail()
    }
    },
    changeData() {

    if (this.chartType=='Group'){
       this.selectChallengeSMS = false
       this.selectChartColumns()
    }else{
      this.searchUsersByEmail()
    }

    },

    async moveResearch () {

      let userIdList=[]
      await db.collection("users").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        userIdList.push(doc.ref.id)
      })
      })

      for (var l=0; l<userIdList.length; l++){
      db.collection("users").doc(userIdList[l]).collection('research').get().then((querySnapshot)=> {

      if (querySnapshot.docs.length>0){
      querySnapshot.forEach(async (doc)=> {

        var idDate = doc.id
        var theList = doc.data()['data']


        //go through data list see what type

        for (var d=0; d<theList.length; d++){
          console.log(theList[d].event +'   '+idDate)
          var cat=''
          var useDate=''
          switch (theList[d].event) {
            case 'Use_Bangla':
              cat = 'researchBangla'

              break;

            default:
              break;
          }
              if (cat.length>0){
            db.collection(cat).doc(idDate)
            .set({
              data: firebase.firestore.FieldValue.arrayUnion(theList[d])
          //    'incidents':theList
            },{merge:true})
            }
        }



       })
      }

      })
      }

    },

    async moveReports(){

      let userIdList=[]
      let userPhones=[]
      await db.collection("users").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {

        userIdList.push(doc.ref.id)
        var pn = doc.data()['userPhone']
        if (pn.length==0){pn='123'}
        userPhones.push(pn)

      })
      })

       console.log(userIdList)

      for (var l=0; l<userIdList.length; l++){



      db.collection("users").doc(userIdList[l]).collection('incidents').get().then((querySnapshot)=> {

      if (querySnapshot.docs.length>0){
      querySnapshot.forEach(async (doc)=> {
       // console.log(doc.ref.parent.parent.id)
        var userId= doc.ref.parent.parent.id
        var ph = await db.collection('users').doc(userId).get()
       // console.log(ph.data().userPhone)
        //console.log(ph.id)
      var theID = doc.id;
      var theList = doc.data()['incidents']
      for (var f=0; f<theList.length; f++){
        //console.log(userIdList[count]+'   '+userPhones[count])
        Object.assign(theList[f], {userPhone: ph.data().userPhone, userId: ph.id});
      db.collection("reportsFiled").doc(doc.id)
      .set({
        incidents: firebase.firestore.FieldValue.arrayUnion(theList[f])
    //    'incidents':theList
      },{merge:true})
      }
      console.log (doc.id)
      console.log(theList)


       })
      }

      })
      }

    },

    async setTimeUserEventsDocs() {

      let userIdList=[]
      await db.collection("users").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {

        userIdList.push(doc.ref.id)
      })
      })

       console.log(userIdList)

      for (var l=0; l<userIdList.length; l++){

      db.collection("users").doc(userIdList[l]).collection('research').get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {

      const splitTime=doc.ref.id.split(' ')[0];
      console.log(splitTime)
      var pushTime = Date.parse(splitTime)
        doc.ref.update({
          createdAt: pushTime
        });
        console.log(moment(pushTime).format('MMM Do YY'))

      })

      })
      }

    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max)+16);
    },



    setTimeAllDocs(){
      db.collection("researchBangla").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
      const splitTime=doc.ref.id.split(' ')[0];
      console.log(splitTime)
      var pushTime = Date.parse(splitTime)
        doc.ref.update({
          createdAt: pushTime
        });
        console.log(moment(pushTime).format('MMM Do YY'))
    });
    });
    },
    setEventAges(){
      var cat='alarm'
      var temp=[]
      db.collection(cat).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {

      //console.log(doc.data()[this.dataList])
      temp.push(doc.data()[this.dataList])

    });
    var newTemp;
    console.log(temp.length)
    for (var t=0; t<temp.length; t++){
       newTemp = temp[t]
      for (var s=0; s<newTemp.length; s++){
        var rndAge = Math.floor(Math.random() * Math.floor(30)+16)
        newTemp[s]['age']=rndAge
      }

    }
    console.log(temp)
    var p=0
    db.collection(cat).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.update({
          events: temp[p]
        });
        p++
      })
    })
    });
    },



    async getGroupData(category, fromDate){


      if (this.dates[0]==null){
        return
      }

      if (this.dates[1]==null){
        this.dates[1]=this.dates[0]
      }

      const fullDate1 = Date.parse(this.dates[0])
      const fullDate2 = Date.parse(this.dates[1])

      console.log('FD '+fullDate2)

      const useDates = []


      if (fullDate1 < fullDate2) {
        useDates.push(fullDate1)
        useDates.push(fullDate2)
      } else {
        useDates.push(fullDate2)
        useDates.push(fullDate1)
      }
      console.log (useDates)

      this.allSearchDates  = this.getDates(useDates[0], useDates[1])

      console.log(useDates[1])

      this.$store.dispatch('queryuser/setDates',this.allSearchDates )

        const testCollection = []
      //context.commit("SET_MATCHES", categories)

      if (!fromDate){
      for (var b=0; b<this.sendBarData.length; b++){
        if (this.sendBarData[b]['name']==category){
          console.log('remove it')
          //this.sendBarData = []
          this.sendBarData.splice(b, 1);
          this.$store.dispatch('queryuser/setNewBarChartData',Object.values(this.sendBarData))

              for (var p=0; p<this.sendPieData.length; p++){
              if (this.sendPieData[p]['name']==category){
                console.log('remove it pie')
                //this.sendBarData = []
                this.sendPieData.splice(p, 1);
                this.$store.dispatch('queryuser/setPieData',this.sendPieData)

              }else{
                console.log('add it pie')
              }
            }

           return
        }else{
          console.log('add it')
        }
      }

      }

      console.log('CAT  '+category)

      await db.collection(category)
        .orderBy('createdAt').startAt(useDates[0]).endAt(useDates[1])
        //   , '==', Date.parse('2020-11-17 00:00:00.000'))
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
          // eslint-disable-next-line no-console
            console.log('cannot find')
            //this.$router.push('/HelloWorld')
          }else{
              var totalCount = 0;
              querySnapshot.forEach((doc) => {
              const coll = []
              const { id } = doc
              const usingDate = moment(id).format('MMM Do YY')

              doc.data()[this.dataList].forEach((doc) => {
                var theTime
                if (doc.time){
                  theTime = doc.time.seconds*1000
                }else if (doc.date){
                  theTime = doc.date.seconds*1000
                }

                var aTime = parseInt (moment(theTime).format('HH'))
                //removed age check for now
                //if (doc.age >= this.lowerAge && doc.age <= this.upperAge){
                  console.log(this.timerange[0] +'   '+this.timerange[1])
                  if (aTime >= this.timerange[0] && aTime <= this.timerange[1]){
                    coll.push({ doc })
                    totalCount++;
                  }
                //}
              })

              testCollection.push({ [usingDate]: coll })

            })
             console.log (category +'  '+totalCount)
             this.sendPieData.push({value: totalCount, name: category})
             this.$store.dispatch('queryuser/setPieData', this.sendPieData)

          }

        })

      await this.fillGroupChartArray(testCollection, category)

         console.log(this.sendBarData)
       this.$store.dispatch('queryuser/setNewBarChartData',Object.values(this.sendBarData))

    },

    async searchUsersByEmail() {

console.log(  'search user')

      this.isLoading = true
      this.message = ''
      this.foundUser = null

      this.challengeList = []
      this.challengeSMSList = []
      this.secretList = []
      this.secretSMSList = []
      this.timerList = []
      this.timerSMSList = []
      this.userSMSList = []
      this.zoneList = []
      this.zoneSMSList = []
      this.alarmList = []

      this.researchChallengeList = [],
      this.researchAlarmList = [],
      this.researchAppOpenedList = [],
      this.researchBanglaList = [],
      this.researchEnglishList = [],
      this.researchSecretList = [],
      this.researchTestOnList = [],
      this.researchTimerList = [],
      this.researchUserSMSList = [],
      this.researchZoneList = [],

      this.sendBarData = []
      this.sendPieData = []

      var newNumber;
      if (this.email.substring(0,3)!='+88'){
        newNumber = '+88'+this.email
      }else{
        newNumber = this.email
      }


      const snapshot = await db
        .collection('users')
        .where('userPhone', '==', newNumber)
        .get()

      if (!snapshot.empty) {
        const userId = snapshot.docs[0].id
        const userData = snapshot.docs[0].data()

        this.foundUser = {
          id: userId,
          ...userData
        }

        const dbUser = await db.collection('users').doc(userId).get()

        if (dbUser !== null) {

          const queryUserData = dbUser.data()

          await this.$store.dispatch('queryuser/setUserData', {
            id: dbUser.id,
            name: queryUserData.username,
            email: queryUserData.email

          })

          this.searchUserAndDate(userId)

        } else {
          console.log('NO USER')
        }
      } else {
        this.message = 'No user with that email found.'
      }
      this.isLoading = false
    },

    getDates(startDate, stopDate) {
      var dateArray = [];
      var currentDate = moment(startDate);
      var stopDate = moment(stopDate);
      while (currentDate <= stopDate) {
          dateArray.push( moment(currentDate).format('MMM Do YY') )
          currentDate = moment(currentDate).add(1, 'days');
      }
      return dateArray;
    },
    async searchUserAndDate(uid) {
     // console.log(this.dates[0] + ' 00:00:00.000')

      const fullDate1 = Date.parse(this.dates[0])
      const fullDate2 = Date.parse(this.dates[1])

      if (this.dates[0]==null){
        return
      }

      if (this.dates[1]==null){
        this.dates[1]=this.dates[0]
      }

      const useDates = []

      if (fullDate1 < fullDate2) {
        useDates.push(fullDate1)
        useDates.push(fullDate2)
      } else {
        useDates.push(fullDate2)
        useDates.push(fullDate1)
      }
      console.log (useDates)

      this.allSearchDates  = this.getDates(useDates[0], useDates[1])

      this.$store.dispatch('queryuser/setDates',this.allSearchDates )

      const testCollection = []
      //context.commit("SET_MATCHES", categories)

      db.collection('users').doc(uid)
        .collection(this.dataSource)
        .orderBy('createdAt').startAt(useDates[0]).endAt(useDates[1])
        // .where('createdAt'
        //   , '==', Date.parse('2020-11-17 00:00:00.000'))
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
          // eslint-disable-next-line no-console
            console.log('cannot find')
          this.$store.dispatch('queryuser/setNewBarChartData',Object.values(this.sendBarData))
          this.$store.dispatch('queryuser/setPieData', this.sendPieData)

            //this.$router.push('/HelloWorld')
          } else {

            querySnapshot.forEach((doc) => {
              const coll = []
              const { id } = doc

              doc.data()[this.dataList].forEach((doc) => {
                var theTime
                if (doc.time){
                  theTime = doc.time.seconds*1000
                }else if (doc.date){
                  theTime = doc.date.seconds*1000
                }
                var aTime = parseInt (moment(theTime).format('HH'))
                if (aTime >= this.timemin && aTime <= this.timemax){
                  coll.push({ doc })
                }
              })

              testCollection.push({ [id]: coll })

            })

            this.allResults = testCollection
            if (this.useRealData){
            this.createArrays()
            }else{
              this.createResearchArrays()
            }
          }
        })

    },
    async createArrays(){

    this.allResults.forEach(doc=>{
      for (const [key, value] of Object.entries(doc)) {
          console.log(`NEW ${key}: ${value}`)

            var theKey=key

            for (const [akey, avalue] of Object.entries(doc[theKey])) {
                console.log(`${akey}: ${avalue}`)
                const usingDate = moment(avalue['doc']['time'].toDate()).format('MMM Do YY')


                console.log(usingDate);

                switch (avalue['doc']['category']) {
                    case 'challenge':
                        this.challengeList.push({ [usingDate] :avalue['doc']})
                        //this.challengeList.push(avalue['doc'])
                        break;
                    case 'challenge-sms':
                        this.challengeSMSList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'secret':
                        this.secretList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'secret-sms':
                        this.secretSMSList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'timer':
                        this.timerList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'timer-sms':
                        this.timerSMSList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'user-sms':
                        this.userSMSList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'zone':
                        this.zoneList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'zones-sms':
                        this.zoneSMSList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'alarm':
                        this.alarmList.push({ [usingDate] :avalue['doc']})
                        break;
                    default:
                        break;
                }
             }

            }
    })

    this.selectChartColumns()

  },

  async selectChartColumns(){

    this.sendBarData=[]
    this.sendPieData=[]

    console.log(this.alarmList)

 if (this.challengeList.length>0 && this.challengeCheck){
      this.sendPieData.push({value: this.challengeList.length, name: 'Confront'})
      await this.fillChartArray(this.challengeList, 'Confront')
    }

    if (this.challengeSMSList.length>0 && this.challengeSMSCheck){
      this.sendPieData.push({value: this.challengeSMSList.length, name: 'Confront SMS'})
      await this.fillChartArray(this.challengeSMSList, 'Confront SMS')
    }

    if (this.secretList.length>0 && this.secretCheck){
      this.sendPieData.push({value: this.secretList.length, name: 'Secret'})
      await this.fillChartArray(this.secretList, 'Secret')
    }

    if (this.secretSMSList.length>0 && this.secretSMSCheck){
      this.sendPieData.push({value: this.secretSMSList.length, name: 'Secret SMS'})
      await this.fillChartArray(this.secretSMSList, 'Secret SMS')
    }

    if (this.timerList.length>0 && this.timerCheck){
      this.sendPieData.push({value: this.timerList.length, name: 'Timer'})
      await this.fillChartArray(this.timerList, 'Timer')
    }

    if (this.timerSMSList.length>0 && this.timerSMSCheck){
      this.sendPieData.push({value: this.timerSMSList.length, name: 'Timer SMS'})
      await this.fillChartArray(this.timerSMSList, 'Timer SMS')
    }

    if (this.zoneList.length>0 && this.zoneCheck){
      this.sendPieData.push({value: this.zoneList.length, name: 'Zone'})
      await this.fillChartArray(this.zoneList, 'Zone')
    }

    if (this.zoneSMSList.length>0 && this. zoneSMSCheck){
      this.sendPieData.push({value: this.zoneSMSList.length, name: 'Zone SMS'})
      await this.fillChartArray(this.zoneSMSList, 'Zone SMS')
    }

    if (this.userSMSList.length>0 && this.userSMSCheck){
      this.sendPieData.push({value: this.userSMSList.length, name: 'User SMS'})
      await this.fillChartArray(this.userSMSList, 'User SMS')
    }

    if (this.alarmList.length>0 && this.alarmCheck){
      this.sendPieData.push({value: this.alarmList.length, name: 'Alarm'})
      await this.fillChartArray(this.alarmList, 'Alarm')
    }

    console.log(this.sendPieData)
     this.$store.dispatch('queryuser/setNewBarChartData',Object.values(this.sendBarData))
     this.$store.dispatch('queryuser/setPieData', this.sendPieData)

  },

  async fillChartArray(createdList, category){

    console.log('LENGTH '+createdList.length)

    var tabulatedList = {}

    for (var t=0; t<this.allSearchDates.length; t++){
      Object.assign(tabulatedList, {[this.allSearchDates[t]]: 0});
    }

    for (var i=0; i<createdList.length; i++){
    for (const [key, value] of Object.entries(createdList[i])) {
          console.log(`NEW ${key}: ${value}`)
          tabulatedList[key]++
          //tabulatedList[key] = value.length
        }
    }

  console.log(tabulatedList)

    await this.sendBarData.push({name: category, data: Object.values(tabulatedList)})

    return
  },


  async createResearchArrays(){

    this.allResults.forEach(doc=>{
      for (const [key, value] of Object.entries(doc)) {
          console.log(`NEW ${key}: ${value}`)

            var theKey=key

            for (const [akey, avalue] of Object.entries(doc[theKey])) {
                console.log(`${akey}: ${avalue}`)
                const usingDate = moment(avalue['doc']['date'].toDate()).format('MMM Do YY')


                console.log(usingDate);


                switch (avalue['doc']['event']) {
                    case 'Challenge_Screen_Recording_Start':
                        this.researchChallengeList.push({ [usingDate] :avalue['doc']})
                        //this.challengeList.push(avalue['doc'])
                        break;
                    case 'Challenge_Screen_Alarm_Used':
                        this.researchAlarmList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'App_Opened':
                        this.researchAppOpenedList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'Use_Bangla':
                        this.researchBanglaList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'Use_English':
                        this.researchEnglishList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'Secret_Recording_Started':
                        this.researchSecretList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'Test_Mode_On':
                        this.researchTestOnList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'Countdown_started':
                        this.researchTimerList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'Home_SMS_Press':
                        this.researchUserSMSList.push({ [usingDate] :avalue['doc']})
                        break;
                    case 'Geofence_Start':
                        this.researchZoneList.push({ [usingDate] :avalue['doc']})
                        break;
                    default:
                        break;
                }
             }

            }
    })

    this.selectResearchChartColumns()

  },


  async selectResearchChartColumns(){

    this.sendBarData=[]
    this.sendPieData=[]


 if (this.researchChallengeList.length>0 && this.challengeCheck){
      this.sendPieData.push({value: this.researchChallengeList.length, name: 'Confront(R)'})
      await this.fillChartArray(this.researchChallengeList, 'Confront(R)')
    }

    if (this.researchAlarmList.length>0 && this.alarmCheck){
      this.sendPieData.push({value: this.researchAlarmList.length, name: 'Alarm(R)'})
      await this.fillChartArray(this.researchAlarmList, 'Alarm(R)')
    }

    if (this.researchAppOpenedList.length>0 && this.zoneCheck){
      this.sendPieData.push({value: this.researchAppOpenedList.length, name: 'AppOpened(R)'})
      await this.fillChartArray(this.researchAppOpenedList, 'AppOpened(R)')
    }

    if (this.researchBanglaList.length>0 && this.timerCheck){
      this.sendPieData.push({value: this.researchBanglaList.length, name: 'Bangla(R)'})
      await this.fillChartArray(this.researchBanglaList, 'Bangla(R)')
    }

    if (this.researchEnglishList.length>0 && this.timerSMSCheck){
      this.sendPieData.push({value: this.researchEnglishList.length, name: 'English(R)'})
      await this.fillChartArray(this.researchEnglishList, 'English(R)')
    }

    if (this.researchSecretList.length>0 && this.secretCheck){
      this.sendPieData.push({value: this.researchSecretList.length, name: 'Secret(R)'})
      await this.fillChartArray(this.researchSecretList, 'Secret(R)')
    }

    if (this.researchTestOnList.length>0 && this.zoneSMSCheck){
      this.sendPieData.push({value: this.researchTestOnList.length, name: 'Test On(R)'})
      await this.fillChartArray(this.researchTestOnList, 'Test On(R)')
    }

    if (this.researchTimerList.length>0 && this. secretSMSCheck){
      this.sendPieData.push({value: this.researchTimerList.length, name: 'Reminder(R)'})
      await this.fillChartArray(this.researchTimerList, 'Reminder(R)')
    }

    if (this.researchUserSMSList.length>0 && this.userSMSCheck){
      this.sendPieData.push({value: this.researchUserSMSList.length, name: 'User SMS(R)'})
      await this.fillChartArray(this.researchUserSMSList, 'User SMS(R)')
    }

    if (this.researchZoneList.length>0 && this.challengeSMSCheck){
      this.sendPieData.push({value: this.researchZoneList.length, name: 'Zone(R)'})
      await this.fillChartArray(this.researchZoneList, 'Zone(R)')
    }

    console.log(this.sendPieData)
     this.$store.dispatch('queryuser/setNewBarChartData',Object.values(this.sendBarData))
     this.$store.dispatch('queryuser/setPieData', this.sendPieData)

  },




  /// for groups ////

  async fillGroupChartArray(createdList, category){

    var tabulatedList = {}

    for (var t=0; t<this.allSearchDates.length; t++){
      Object.assign(tabulatedList, {[this.allSearchDates[t]]: 0});
    }

    for (var i=0; i<createdList.length; i++){
    for (const [key, value] of Object.entries(createdList[i])) {
          console.log(`NEW ${key}: ${value}`)

          tabulatedList[key] = value.length

          //get values below e.g. map locations

          // for (var v=0; v<value.length; v++){
          //   console.log (value[v]['doc']['eventId'])
          // }

        }
    }

  //console.log(tabulatedList)

    await this.sendBarData.push({name: category, data: Object.values(tabulatedList)})

    return
  }



  }
}
</script>
