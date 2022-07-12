<template>
  <v-footer height="60" class="d-block text-center">
    <div>Copyright © 2022 - v{{ appVersion }}</div>
    <a href="https://edupiatutor.vn">https://edupiatutor.vn</a>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    appVersion() {
      return this.$store.getters.appVersion
    }
  }
}
</script>
