import newsfeed from './content/newsfeed'

/*
|---------------------------------------------------------------------
| TODO Vuex State
|---------------------------------------------------------------------
*/
export default {
  newsfeed,

  // labels
  newsfeedlabels: [{
    id: 'news',
    title: 'News',
    color: 'green'
  },{
    id: 'info',
    title: 'Info',
    color: 'orange'
  },
  {
    id: 'warn',
    title: 'Alert',
    color: 'red'
  }
  ]
}
