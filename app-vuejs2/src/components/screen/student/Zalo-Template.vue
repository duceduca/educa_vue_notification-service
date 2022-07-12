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
              <v-toolbar-title>{{ $t('zalo_template.TITLE') }}</v-toolbar-title>
            </div>
          </v-flex>
        </v-layout>
      </template>

      <!--time limit template-->
      <template v-slot:[`item.timelimit`]="{ item }">
        {{ formatLimit(item.timelimit) }}
      </template>

      <!--action template-->
      <template v-slot:[`item.id`]="{ item }">
        <v-layout class="justify-center">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn id="edit" icon v-on="on" @click="attempt(item)">
                <v-icon>mdi-location-enter</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('quizzes.ATTEMPT') }}</span>
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
      <!--      <template v-slot:no-data>{{ $t('dataTable.NO_DATA') }}</template>-->

      <!--no results template-->
      <template v-slot:no-results>{{ $t('dataTable.NO_RESULTS') }}</template>
    </v-data-table>

    <ErrorMessage />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import router from '@/router'
import { getFormatLimitTime } from '@/utils/utils'

export default {
  name: 'Quizzes',
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('zalo_template.TITLE')} - %s`
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
          text: this.$i18n.t('zalo_template.templateId'),
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: this.$i18n.t('zalo_template.templateName'),
          align: 'left',
          sortable: false,
          value: 'attempts'
        },
        {
          text: this.$i18n.t('zalo_template.createdTime'),
          align: 'left',
          sortable: false,
          value: 'timelimit'
        },
        {
          text: this.$i18n.t('zalo_template.status'),
          value: 'id',
          sortable: false,
          width: 100
        }
      ]
    },
    items() {
      return this.$store.state.quizzes.quizzes
    },
    totalItems() {
      return this.$store.state.quizzes.quizzes.length
    }
  },
  watch: {
    pagination: {
      handler() {
        // console.info(`(handler)`)
        this.load()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getQuizzes']),

    formatLimit(seconds) {
      return getFormatLimitTime(seconds)
    },

    async attempt(item) {
      if (item.attempts === 0) {
        const response = await this.$confirm(
          this.$t('zalo_template.ARE_YOU_READY_TO_ATTEMPT'),
          {
            title: this.$t('common.WARNING'),
            buttonTrueText: this.$t('common.YES'),
            buttonFalseText: this.$t('common.NO'),
            buttonTrueColor: 'red lighten3',
            buttonFalseColor: 'green'
          }
        )
        if (response) {
          router.push({
            name: 'student-quiz',
            params: { id: item.id }
          })
        }
      } else {
        router.push({
          name: 'student-quiz',
          params: { id: item.id }
        })
      }
    },

    async load() {
      // console.info(`(load)`)
      try {
        this.dataTableLoading = true
        await this.getQuizzes()
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
