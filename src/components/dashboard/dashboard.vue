<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <p>User: {{ user }}</p>
  </div>
</template>

<script>
// We import axios in main.js and set global defaults. We still need to import axios in each
// component we use. The axios import will be merged, so the defaults are set through main.js
import axios from 'axios'

export default {
  created () {
    this.$store.dispatch('fetchUser')
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  }
}
</script>

<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>