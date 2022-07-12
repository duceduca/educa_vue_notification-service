<template>
  <v-container> abc </v-container>
</template>

<script>
export default {
  name: 'Course',
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('home.TITLE')} - %s`
    }
  },
  data() {
    return {
      name: this.$store.state.auth.user.fullName,
      showVerifyDialog: !this.$store.state.verify.emailVerified
    }
  }
}
</script>
