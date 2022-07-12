<template>
  <div>
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
        'disable-items-per-page': true,
        'items-per-page-text': $t('dataTable.ROWS_PER_PAGE'),
        'items-per-page-options': [5, 10, 25]
      }"
    >
      <!--title template-->
      <template v-slot:top>
        <v-layout wrap>
          <v-flex xs12 sm12 md4 mt-3 pl-4>
            <div class="text-left">
              <v-toolbar-title>{{ $t('quiz.TITLE') }}</v-toolbar-title>
            </div>
          </v-flex>
        </v-layout>
      </template>

      <!--time start template-->
      <template v-slot:[`item.timestart`]="{ item }">
        {{ formatTime(item.timestart) }}
      </template>

      <!--time finish template-->
      <template v-slot:[`item.timefinish`]="{ item }">
        {{ formatTime(item.timefinish) }}
      </template>

      <!--action template-->
      <template v-slot:[`item.id`]="{ item }">
        <v-layout class="justify-center">
          <v-tooltip top v-if="item.state === 'finished'">
            <template v-slot:activator="{ on }">
              <v-btn id="edit" icon v-on="on" @click="detail(item)">
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('quiz.DETAIL') }}</span>
          </v-tooltip>
        </v-layout>
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

    <ErrorMessage />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import router from '@/router'
import { getFormatTimestamp } from '@/utils/utils'

export default {
  name: 'Quiz',
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('quiz.TITLE')} - %s`
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
          text: this.$i18n.t('quiz.STATE'),
          align: 'left',
          sortable: false,
          value: 'state'
        },
        {
          text: this.$i18n.t('quiz.SUM_GRADES'),
          align: 'left',
          sortable: false,
          value: 'sumgrades'
        },
        {
          text: this.$i18n.t('quiz.TIME_START'),
          align: 'left',
          sortable: false,
          value: 'timestart'
        },
        {
          text: this.$i18n.t('quiz.TIME_FINISH'),
          align: 'left',
          sortable: false,
          value: 'timefinish'
        },
        {
          text: this.$i18n.t('dataTable.ACTIONS'),
          value: 'id',
          sortable: false,
          width: 100
        }
      ]
    },
    items() {
      const quizAttempt = this.$store.state.quizzes.quizAttempts.find(
        (o) => o.quizId === this.quizId
      )
      if (quizAttempt) {
        return quizAttempt.attempts
      }
      return []
    },
    quizId() {
      return this.$route.params.id
    },
    totalItems() {
      return this.items.length
    }
  },
  watch: {
    items(value) {
      if (value.length === 1 && value[0].state === 'inprogress') {
        router.push({
          name: 'student-attempt',
          params: { id: value[0].id }
        })
      }
    },
    pagination: {
      handler() {
        console.info(`(handler)`)
        this.load()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getAttempts']),

    formatTime(time) {
      // console.info(`(formatTime)date: ${time}`)
      window.__localeId__ = this.$store.getters.locale
      return getFormatTimestamp(time * 1000)
    },

    async detail(item) {
      router.push({
        name: 'student-attempt-result',
        params: { id: item.id }
      })
    },

    async load() {
      // console.info(`(load)`)
      try {
        this.dataTableLoading = true
        await this.getAttempts(this.quizId)
      } catch (error) {
        console.error(`(load)error: ${error.message}`)
      }
      this.dataTableLoading = false
    }
  }
}
</script>

<style>
table.v-table {
  max-width: none;
}
</style>
