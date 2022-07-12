<template>
  <v-container>
    <v-row v-for="(answer, index) in question.answers" :key="answer.id">
      <v-checkbox
        :label="`${getIndexText(index)}. `"
        :value="answerData.answer.includes(index)"
      />
      <div
        v-html="formatHtml('answer', answer.id, answer.answer)"
        class="v-input--selection-controls mt-4 ml-1"
      />
    </v-row>
  </v-container>
</template>

<script>
import { formatHtml, getIndexText } from '@/utils/utils'

export default {
  name: 'MultipleChoiceMultipleAnswer',
  props: ['answerData', 'question', 'saveAnswer'],
  mounted() {
    console.info(`(mounted)question: ${JSON.stringify(this.question)}`)
  },
  computed: {
    html() {
      return formatHtml(this.question.id, this.currentQuestion.questiontext)
    }
  },
  methods: {
    formatHtml,
    getIndexText,
    updateCheckBox(id, value) {
      console.info(`(updateCheckBox)id: ${id}, value: ${value}`)
      this.saveAnswer(id)
    }
  }
}
</script>
