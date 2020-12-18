<template>
  <safeplaces-list
    :safeplaces="completeSafeplaces"
    @edit-safeplaces="$emit('edit-safeplaces', $event)"
  />
</template>

<script>
import { mapGetters } from "vuex";
import SafeplacesList from "../components/SafeplacesList";

export default {
  components: {
    SafeplacesList,
  },
  computed: {
    ...mapGetters("safeplaces-app", ["completeSafeplaces"]),
  },
};
</script>
