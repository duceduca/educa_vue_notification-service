<template>
  <v-flex
    xs12
    sm12
    md3
    lg3
    :class="{
      'pa-2': $vuetify.breakpoint.smAndDown,
      'pa-0': $vuetify.breakpoint.mdAndUp
    }"
  >
    <v-card elevation="5" justify-center>
      <v-card-title>
        <v-container>
          <!--quiz: name-->
          <span class="headline">
            <b>{{ quizName }}</b>
          </span>
          <v-divider></v-divider>
          <!--quiz: time-->
          {{ quizTime }}
          <br />
          <!--quiz: total questions-->
          {{ totalQuestion }}
        </v-container>
      </v-card-title>
      <v-card-text height="100%">
        <!--attempt timer-->
        <v-avatar color="red" size="256">
          <span class="white--text text-h4">
            {{ $t('quizAttempt.TIME') }} <br />
            {{ remainTime }}
          </span>
        </v-avatar>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'AttemptInformation',
  props: ['name', 'time', 'numberOfQuestion', 'timer'],
  computed: {
    quizName() {
      return this.name
    },
    quizTime() {
      return this.time
    },
    remainTime() {
      return this.timer
    },
    totalQuestion() {
      return this.numberOfQuestion
    }
  }
}
</script>
