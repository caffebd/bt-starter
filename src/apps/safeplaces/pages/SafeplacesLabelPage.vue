<template>
  <safeplaces-list
    :safeplaces="labelNewsfeed"
    @edit-safeplaces="$emit('edit-safeplaces', $event)"
  />
</template>

<script>
import { mapState } from "vuex";
import SafeplacesList from "../components/SafeplacesList";

export default {
  components: {
    SafeplacesList,
  },
  computed: {
    ...mapState("safeplaces-app", ["safeplaces"]),
    labelSafeplaces() {
      return this.safeplaces
        .filter((t) => t.labels.indexOf(this.$route.params.id) !== -1)
        .sort((a, b) => (a === false ? 1 : -1));
    },
  },
};
</script>
