<template>
  <v-container fluid>
    <v-layout row wrap>
      <!--loading-->
      <Loading :show="dataLoading" />

      <!--question box-->
      <v-flex xs12 sm12 md9 lg9 px-2>
        <v-card elevation="5">
          <!--question: number-->
          <v-card-title>
            <v-container>
              <v-row>
                <span class="headline">
                  {{ this.$t('quizAttempt.QUESTION_NUMBER') }}
                  {{ this.currentQuestionIndex + 1 }}
                </span>
              </v-row>
              <v-row>
                <v-divider></v-divider>
              </v-row>
            </v-container>
          </v-card-title>

          <v-card-text>
            <v-container>
              <!--question: text-->
              <v-row>
                <div align="left" v-html="this.currentQuestionText"></div>
              </v-row>

              <!--question: answer header-->
              <v-row v-if="currentQuestion.type !== 'description'">
                <span class="headline">
                  {{ this.$t('quizAttempt.ANSWER') }}
                </span>
              </v-row>
              <v-row>
                <v-divider></v-divider>
              </v-row>

              <!--question: answer list-->
              <v-row>
                <MultipleChoiceMultipleAnswer
                  v-if="currentQuestion.type === 'multichoice1'"
                  :answerData="answersData[currentQuestionIndex]"
                  :question="currentQuestion"
                  :saveAnswer="updateAnswer"
                />

                <MultipleChoiceSingleAnswer
                  v-if="currentQuestion.type === 'multichoice'"
                  :answerData="answersData[currentQuestionIndex]"
                  :question="currentQuestion"
                  :saveAnswer="updateAnswer"
                />
              </v-row>

              <!--question: chooser bar-->
              <v-row class="pt-8">
                <QuestionChooserBar
                  :answersData="this.answersData"
                  :changeQuestion="changeQuestion"
                />
              </v-row>

              <!--question: submit-->
              <v-row align="center">
                <v-container>
                  <v-btn color="blue" @click="checkSubmit">
                    {{ this.$t('quizAttempt.SUBMIT') }}
                  </v-btn>
                </v-container>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>

      <!--information box-->
      <AttemptInformation
        :name="currentQuiz.name"
        :time="quizTime"
        :numberOfQuestion="totalQuestion"
        :timer="timerText"
      />

      <div class="text-center">
        <v-dialog v-model="showVerifyDialog" width="80%" persistent>
          <v-card>
            <v-card-title
              class="headline grey lighten-2 black--text"
              primary-title
            >
              {{ $t('quizAttempt.DO_YOU_REALLY_WANT_TO_SUBMIT') }}
            </v-card-title>
            <v-card-text class="mt-4">
              {{ $t('quizAttempt.SUBMIT_DESCRIPTION') }}
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="submitAnswers">
                {{ $t('quizAttempt.YES') }}
              </v-btn>
              <v-btn @click="showVerifyDialog = false">
                {{ $t('quizAttempt.NO') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <ErrorMessage />
      <SuccessMessage />
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import AttemptInformation from '@/components/quiz/AttemptInformation.vue'
import MultipleChoiceMultipleAnswer from '@/components/quiz/MultipleChoiceMultipleAnswer.vue'
import MultipleChoiceSingleAnswer from '@/components/quiz/MultipleChoiceSingleAnswer.vue'
import QuestionChooserBar from '@/components/quiz/QuestionChooserBar.vue'
import router from '@/router'
import * as types from '@/store/mutation-types'
import { ANSWER_STATUS } from '@/utils/constants'
import { formatHtml, getFormatLimitTime } from '@/utils/utils'

export default {
  name: 'Attempt',
  components: {
    AttemptInformation,
    MultipleChoiceMultipleAnswer,
    MultipleChoiceSingleAnswer,
    QuestionChooserBar
  },
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('quizAttempt.TITLE')} - %s`
    }
  },
  data() {
    return {
      answersData: [],
      currentQuestion: {},
      currentQuestionIndex: 0,
      dataLoading: false,
      isSubmitEarly: true,
      showVerifyDialog: false,
      timer: null,
      timerText: ''
    }
  },
  computed: {
    attemptId() {
      return this.$route.params.id
    },
    attemptData() {
      console.info(`(attemptData)attemptId: ${this.attemptId}`)
      const attempt = this.$store.state.quizzes.attemptsData.find(
        (o) => o.attemptId === this.attemptId
      )
      console.info(`(attemptData)attempt: ${JSON.stringify(attempt)}`)
      if (attempt) {
        return attempt.data
      }
      return {}
    },
    currentQuestionText() {
      console.info(`(currentQuestionText)`)
      if (this.currentQuestion.questiontext) {
        const html = formatHtml(
          'questiontext',
          this.currentQuestion.id,
          this.currentQuestion.questiontext
        )
        console.info(`(currentQuestionText)html: ${html}`)
        return html
      }

      return ''
    },
    currentQuiz() {
      if (this.attemptData.quiz) {
        return this.attemptData.quiz
      }
      return {}
    },
    questions() {
      if (this.attemptData.questions) {
        return this.attemptData.questions
      }
      return []
    },
    quizTime() {
      return `${this.$t('quizAttempt.QUIZ_TIME')}: ${this.formatLimit(
        this.currentQuiz.timelimit
      )}`
    },
    totalQuestion() {
      return `${this.$t('quizAttempt.TOTAL_QUESTION')}: ${this.questions.length}
              ${this.$t('quizAttempt.QUESTION')}`
    }
  },
  mounted() {
    this.load()
    const attempt = this.$store.state.quizzes.attemptsAnswers.find(
      (o) => o.attemptId === this.attemptId
    )
    if (attempt) {
      this.answersData = attempt
    }
  },
  watch: {
    attemptData(value) {
      console.info(`(attemptData)state: ${JSON.stringify(value)}`)
      if (value.attempt && value.attempt.state === 'finished') {
        console.info(`(attemptData)redirect ---> `)
        // TODO: enable after result page finish
        // router.push({
        //   name: 'student-attempt-result',
        //   params: { id: this.attemptId }
        // })
        router.push({
          name: 'student-quiz',
          params: { id: value.attempt.quiz }
        })
      }
    },
    questions(value) {
      console.info(`(questions)value: ${value.length}`)
      if (value.length > 0) {
        this.currentQuestion = value[0]
        if (this.answersData.length === 0) {
          this.answersData = this.initAnswerData(this.questions)
        }
      }

      if (this.attemptData && this.attemptData.attempt) {
        this.startTimer()
      }
    }
  },

  methods: {
    ...mapActions(['getAttemptData', 'submit']),

    changeQuestion(selectedIndex) {
      console.info(`(changeQuestion)selectedIndex: ${selectedIndex}`)
      this.currentQuestion = this.questions[selectedIndex]
      this.currentQuestionIndex = selectedIndex
      let index = 0
      while (index < this.answersData.length) {
        // console.info(`(changeQuestion)index: ${index}`)
        if (
          this.answersData[index].status === ANSWER_STATUS.DONE ||
          this.answersData[index].status === ANSWER_STATUS.DISABLED
        ) {
          // do nothing
        } else if (index === selectedIndex) {
          this.answersData[index].status = ANSWER_STATUS.PROCESSING
        } else {
          this.answersData[index].status = ANSWER_STATUS.TODO
        }
        index++
      }
      // console.info(`(changeQuestion)end`)
    },

    checkSubmit() {
      if (this.isSubmitEarly) {
        this.$store.commit(types.ERROR, 'SUBMIT_EARLY')
      } else {
        this.showVerifyDialog = true
      }
    },

    formatLimit(seconds) {
      console.info(`(formatLimit)seconds: ${seconds}`)
      return getFormatLimitTime(seconds)
    },

    initAnswerData(questions) {
      console.info(`(initAnswerData)questions: ${questions.length}`)
      const answersData = []
      let index = 0
      while (index < questions.length) {
        let status = ANSWER_STATUS.TODO
        if (index === 0) {
          status = ANSWER_STATUS.PROCESSING
        }
        if (questions[index].type === 'description') {
          status = ANSWER_STATUS.DISABLED
        }
        answersData.push({
          index,
          status,
          answer: []
        })
        index++
      }
      console.info(`(initAnswerData)answers: ${answersData.length}`)
      return answersData
    },

    persistData() {
      this.$store.dispatch('setAnswersData', {
        data: this.answersData,
        quizId: this.quizId
      })
    },

    startTimer() {
      this.timer = setInterval(() => {
        const startTime = this.attemptData.attempt.timestart
        const currentTime = Math.floor(Date.now() / 1000)
        const duration = this.currentQuiz.timelimit - currentTime + startTime

        let minutes = parseInt(duration / 60, 10)
        let seconds = parseInt(duration % 60, 10)

        minutes = minutes < 10 ? `0${minutes}` : minutes
        seconds = seconds < 10 ? `0${seconds}` : seconds

        this.timerText = `${minutes}:${seconds}`

        this.isSubmitEarly = this.attemptData.quiz.timelimit * 2 < duration * 3

        if (duration < 0) {
          // Finish Quiz
          this.submitAnswers()
          clearInterval(this.timer)
        }
      }, 1000)
    },

    updateAnswer(value) {
      console.info(`(updateAnswer)value: ${value}`)
      if (this.currentQuestion.type === 'multichoice') {
        this.answersData[this.currentQuestionIndex].answer = []
        this.answersData[this.currentQuestionIndex].answer.push(value)
        this.answersData[this.currentQuestionIndex].status = ANSWER_STATUS.DONE
      } else {
        this.answersData[this.currentQuestionIndex].answer.push(value)
      }

      this.persistData()
    },

    updateCheckBox(id, value) {
      console.info(`(saveAnswer)id: ${id}, value: ${value}`)
    },

    async load() {
      console.info(`(load)`)
      try {
        await this.getAttemptData(this.attemptId)
      } catch (error) {
        console.error(`(load)error: ${error.message}`)
      }
    },

    async submitAnswers() {
      console.info(
        `(submitAnswers)answerData: ${JSON.stringify(this.answersData)}`
      )
      this.showVerifyDialog = false

      const answers = []
      let index = 1
      for (const answerData of this.answersData) {
        const answer = {
          slot: index,
          status: answerData.status,
          answer: answerData.answer.length > 0 ? answerData.answer[0] : ''
          // TODO: use for multiple answers
          // answer: JSON.stringify(answerData.answer)
        }
        answers.push(answer)
        index++
      }

      console.info(`(submitAnswers)uniqueId: ${this.attemptData.uniqueid}`)
      try {
        await this.submit({
          attemptId: this.attemptId,
          uniqueId: this.attemptData.uniqueid,
          answers
        })
      } catch (error) {
        console.error(`(submitAnswers)error: ${error.message}`)
      }
    }
  }
}
</script>

<style scoped></style>
