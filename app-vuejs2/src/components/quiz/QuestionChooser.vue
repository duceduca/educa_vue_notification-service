<template>
  <v-chip :color="color" @click="click">
    <v-icon v-if="isInformation"> mdi-lightbulb-outline </v-icon>
    {{ this.label }}
  </v-chip>
</template>

<script>
import { ANSWER_STATUS } from '@/utils/constants'

export default {
  name: 'QuestionChooser',
  props: ['index', 'status', 'chooseMe'],
  computed: {
    color() {
      if (this.status === ANSWER_STATUS.DISABLED) {
        return 'yellow'
      }
      if (this.status === ANSWER_STATUS.DONE) {
        return 'blue'
      }
      if (this.status === ANSWER_STATUS.PROCESSING) {
        return 'green'
      }
      return 'grey'
    },
    isInformation() {
      return this.status === ANSWER_STATUS.DISABLED
    },
    label() {
      const showedIndex = this.index + 1
      if (showedIndex < 10) {
        return `${this.$t('quizAttempt.QUESTION_UPPER')} 0${showedIndex}`
      }
      return `${this.$t('quizAttempt.QUESTION_UPPER')} ${showedIndex}`
    }
  },
  methods: {
    click() {
      console.info(`(click)`)
      this.chooseMe(this.index)
    }
  }
}
</script>

<style scoped></style>
