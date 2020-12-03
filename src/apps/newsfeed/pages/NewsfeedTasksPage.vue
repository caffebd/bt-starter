<template>
  <newsfeed-list :newsfeed="incompleteNewsfeed" @edit-newsfeed="$emit('edit-newsfeed', $event)" />
</template>

<script>
import { mapGetters } from 'vuex'
import NewsfeedList from '../components/NewsfeedList'

export default {
  components: {
    NewsfeedList
  },
  computed: {
    ...mapGetters('newsfeed-app', ['incompleteNewsfeed'])
  }
}
</script>
