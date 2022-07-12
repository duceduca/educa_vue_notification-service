<template>
  <v-container>
    <QuestionChooser
      v-for="answer in this.answersData"
      :key="answer.index"
      :index="answer.index"
      :status="answer.status"
      :chooseMe="switchQuestion"
      class="ma-1"
    />
  </v-container>
</template>

<script>
import QuestionChooser from '@/components/quiz/QuestionChooser.vue'

export default {
  name: 'QuestionChooserBar',
  props: ['answersData', 'changeQuestion'],
  components: {
    QuestionChooser
  },
  methods: {
    switchQuestion(index) {
      console.info(`(switchQuestion)index: ${index}`)
      this.changeQuestion(index)
    }
  }
}
</script>

<style scoped></style>
