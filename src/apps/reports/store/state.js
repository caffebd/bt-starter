import reports from './content/reports'

/*
|---------------------------------------------------------------------
| TODO Vuex State
|---------------------------------------------------------------------
*/
export default {
  reports,

  // labels
  reportslabels: [{
    id: 'Violence',
    title: 'Violence',
    color: 'red'
  },{
    id: 'Harassment',
    title: 'Harassment',
    color: 'orange'
  },
  {
    id: 'Sexual Violence',
    title: 'Sexual Violence',
    color: 'blue'
  }
  ]
}
