
<template>
<div>
    <v-list-item v-if="menuItem.text !='News Pages Top' && menuItem.text !='Places Pages Top'&& userRole==true"
      :input-value="menuItem.value"
      :to="menuItem.link"
      :exact="menuItem.exact"
      :disabled="menuItem.disabled"
      active-class="primary--text"
      link
    >
    
      <v-list-item-icon >
      <v-badge
        v-if="menuItem.text=='Alerts Page'"
        avatar
        bordered
        overlap
        :value="newMessages"
        color="red"

      >
        <v-icon :color="useColor" :small="small" :class="{ 'grey--text': menuItem.disabled }">
          {{ menuItem.icon || 'mdi-circle-medium' }}
        </v-icon>

      </v-badge>
          <v-icon v-else color="blue" :small="small" :class="{ 'grey--text': menuItem.disabled }">
          {{ menuItem.icon || 'mdi-circle-medium' }}
        </v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>
          {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
        </v-list-item-title>
      </v-list-item-content>

    </v-list-item>

    <v-list-item v-if="menuItem.text=='News Pages Top' && userRole==false"
      :input-value="menuItem.value"
      :to="menuItem.link"
      :exact="menuItem.exact"
      :disabled="menuItem.disabled"
      active-class="primary--text"
      link
    >
      <v-list-item-icon v-if="menuItem.text=='News Pages Top'">
        <v-icon color="blue" :small="small" :class="{ 'grey--text': menuItem.disabled }">
          {{ menuItem.icon || 'mdi-circle-medium' }}
        </v-icon>
      </v-list-item-icon>

      <v-list-item-content v-if="menuItem.text=='News Pages Top'">
        <v-list-item-title>
          {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="menuItem.text=='Places Pages Top' && userRole==false"
      :input-value="menuItem.value"
      :to="menuItem.link"
      :exact="menuItem.exact"
      :disabled="menuItem.disabled"
      active-class="primary--text"
      link
    >
      <v-list-item-icon v-if="menuItem.text=='Places Pages Top'">
        <v-icon color="blue" :small="small" :class="{ 'grey--text': menuItem.disabled }">
          {{ menuItem.icon || 'mdi-circle-medium' }}
        </v-icon>
      </v-list-item-icon>

      <v-list-item-content v-if="menuItem.text=='Places Pages Top'">
        <v-list-item-title>
          {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

   </div>
  </template>

    <!-- <v-list-group
      v-else
      :value="menuItem.regex ? menuItem.regex.test($route.path) : false"
      :disabled="menuItem.disabled"
      :sub-group="subgroup"
      :to="menuItem.link"
      link
    >

      <template v-slot:activator>
        <v-list-item-icon v-if="!subgroup">
          <v-icon :small="small">{{ menuItem.icon || 'mdi-circle-medium' }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <slot></slot>

    </v-list-group> -->

<script>
/*
|---------------------------------------------------------------------
| Navigation Menu Item Component
|---------------------------------------------------------------------
|
| Navigation items for the NavMenu component
|
*/
export default {
  props: {
    menuItem: {
      type: Object,
      default: () => {}
    },
    subgroup: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      messages: 0
    }
  },
  computed: {
    useColor () {
      return this.$store.state.user.color
    },
    newsItem () {
    var newsmenu = [{
    text: '',
    key: '',
    items: [
      { icon: 'mdi-newspaper-variant-outline', key: 'menu.formspage', text: 'News Pages', link: '/apps/newsfeed' }
    ]
    }]
      return newsmenu
    },
    newMessages () {
      return this.$store.state.user.newMessages
    },
    userRole () {
      return this.$store.state.user.isAdmin
    }
  }
}
</script>
