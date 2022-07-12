<template>
  <v-data-table
    :loading="dataTableLoading"
    :no-data-text="$t('dataTable.NO_DATA')"
    :no-results-text="$t('dataTable.NO_RESULTS')"
    :headers="headers"
    :items="items"
    :options.sync="pagination"
    :items-per-page="10"
    :server-items-length="totalItems"
    class="elevation-1"
    :footer-props="{
      'disable-items-per-page': false,
      'items-per-page-text': $t('dataTable.ROWS_PER_PAGE'),
      'items-per-page-options': [5, 10, 25]
    }"
  >
    <!--title template-->
    <template v-slot:top>
      <v-layout wrap>
        <v-flex xs12 sm12 md4 mt-3 pl-4>
          <div class="text-left">
            <v-toolbar-title>{{
              $t('quizAttemptResults.TITLE')
            }}</v-toolbar-title>
          </div>
        </v-flex>
      </v-layout>
    </template>

    <!--mark template-->
    <template v-slot:[`item.mark`]="{ item }">
      {{ item.mark === null ? (item.mark = 0) : item.mark }}
    </template>

    <!--footer template-->
    <template
      v-slot:[`footer.page-text`]="{ pageStart, pageStop, itemsLength }"
    >
      {{ pageStart }} - {{ pageStop }}
      {{ $t('dataTable.OF') }}
      {{ itemsLength }}
    </template>

    <!--no data template-->
    <template v-slot:no-data>{{ $t('dataTable.NO_DATA') }}</template>

    <!--no result template-->
    <template v-slot:no-results>{{ $t('dataTable.NO_RESULTS') }}</template>
  </v-data-table>
</template>

<script>
import { mapActions } from 'vuex'
import { getFormatTimestamp } from '@/utils/utils'

export default {
  name: 'AttemptResult',
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('quizAttemptResults.TITLE')} - %s`
    }
  },
  data() {
    return {
      dataTableLoading: true,
      pagination: {}
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$i18n.t('quizAttemptResults.SLOT'),
          align: 'left',
          sortable: false,
          value: 'slot'
        },
        {
          text: this.$i18n.t('quizAttemptResults.TYPE'),
          align: 'left',
          sortable: false,
          value: 'type'
        },
        {
          text: this.$i18n.t('quizAttemptResults.STATE'),
          align: 'left',
          sortable: false,
          value: 'state'
        },
        {
          text: this.$i18n.t('quizAttemptResults.STATUS'),
          align: 'left',
          sortable: false,
          value: 'status'
        },
        {
          text: this.$i18n.t('quizAttemptResults.QUESTION'),
          align: 'left',
          sortable: false,
          value: 'question'
        },
        {
          text: this.$i18n.t('quizAttemptResults.ANSWER'),
          align: 'left',
          sortable: false,
          value: 'answer'
        },
        {
          text: this.$i18n.t('quizAttemptResults.MARK'),
          value: 'mark',
          sortable: false,
          align: 'left'
        }
      ]
    },
    items() {
      const data = this.$store.state.quizzes.attemptsResult
      return data[0]?.questions
    },
    attemptId() {
      return this.$route.params.id
    },
    totalItems() {
      const data = this.$store.state.quizzes.attemptsResult
      console.log(data[0]?.questions)
      return data[0]?.questions.length
    }
  },
  watch: {
    pagination: {
      handler() {
        console.info(`(handler)`)
        this.load()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getResult']),

    formatTime(time) {
      // console.info(`(formatTime)date: ${time}`)
      window.__localeId__ = this.$store.getters.locale
      return getFormatTimestamp(time * 1000)
    },

    async load() {
      // console.info(`(load)`)
      try {
        this.dataTableLoading = true
        await this.getResult(this.attemptId)
      } catch (error) {
        console.error(`(load)error: ${error.message}`)
      }
      this.dataTableLoading = false
    }
  }
}
</script>

<style scoped>
table.v-table {
  max-width: none;
}
</style>
