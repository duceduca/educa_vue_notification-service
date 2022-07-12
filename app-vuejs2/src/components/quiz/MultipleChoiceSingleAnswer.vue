<template>
  <v-container>
    <v-row>
      <v-radio-group v-model="selectedValue">
        <v-radio
          v-for="(answer, index) in question.answers"
          :key="answer.id"
          :value="index"
          @click="click(index)"
        >
          <template slot="label">
            <div v-html="formatHtml('answer', answer.id, answer.answer)" />
          </template>
        </v-radio>
      </v-radio-group>
    </v-row>
  </v-container>
</template>

<script>
import { formatHtml } from '@/utils/utils'

export default {
  name: 'MultipleChoiceSingleAnswer',
  props: ['answerData', 'question', 'saveAnswer'],
  data() {
    return {
      selectedValue: null
    }
  },
  mounted() {
    console.info(`(mounted)question: ${JSON.stringify(this.question)}`)
    this.selectedValue = this.answerData.answer[0]
  },
  updated() {
    console.info(`(updated)`)
    this.selectedValue = this.answerData.answer[0]
  },
  watch: {
    selectedValue(value) {
      console.info(`(selectedValue)value: ${value}`)
    }
  },
  methods: {
    formatHtml,
    click(index) {
      console.info(`(click)index: ${index}`)
      this.saveAnswer(index)
    }
  }
}
</script>
