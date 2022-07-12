<template>
  <v-container fluid>
    <v-layout row wrap>
      <Heading :title="$t('login.TITLE')" />
      <ErrorMessage />
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginToken',
  methods: {
    ...mapActions(['loginToken']),
    async load() {
      const token = this.$route.query.token
      await this.loginToken({ token })
    }
  },
  mounted() {
    this.load()
  }
}
</script>
