import alerts from './content/alerts'

/*
|---------------------------------------------------------------------
| TODO Vuex State
|---------------------------------------------------------------------
*/
export default {
  alerts,

  // labels
  labels: [
    {
      id: 'challenge',
      title: 'Challenge',
      color: 'red'
    },
    {
      id: 'challenge-sms',
      title: 'Challenge-sms',
      color: 'red'
    },
    {
      id: 'zone',
      title: 'Zone',
      color: 'red'
    },
    {
      id: 'zone-sms',
      title: 'Zone-sms',
      color: 'red'
    },
    {
      id: 'timer',
      title: 'Timer',
      color: 'red'
    },
    {
      id: 'timer-sms',
      title: 'Timer-sms',
      color: 'red'
    },
    {
      id: 'secret',
      title: 'Secret',
      color: 'red'
    },
    {
      id: 'secret-sms',
      title: 'Secret-sms',
      color: 'red'
    },
    {
      id: 'alarm',
      title: 'Alarm',
      color: 'red'
    },
    {
      id: 'user-sms',
      title: 'User-sms',
      color: 'red'
    }
  ]
}
