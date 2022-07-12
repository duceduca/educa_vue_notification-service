<template>
  <v-dialog v-model="showLoading" width="80%" persistent>
    <v-card>
      <v-card-text class="mt-2 mb-2 pt-2 pb-2">
        <v-progress-linear indeterminate color="yellow darken-2" />
        <br />
        <v-progress-linear indeterminate color="green" />
        <br />
        <v-progress-linear indeterminate color="teal" />
        <br />
        <v-progress-linear indeterminate color="cyan" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Loading',
  props: ['show'],
  computed: {
    showLoading() {
      return this.show
    }
  },
  watch: {
    showLoading(value) {
      console.info(`(showLoading)value: ${value}`)
    }
  }
}
</script>
