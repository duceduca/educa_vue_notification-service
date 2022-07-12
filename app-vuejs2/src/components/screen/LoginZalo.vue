<template>
  <v-container fluid>
    <v-layout row wrap>
      <Heading :title="$t('loginClassCode.TITLE')" />
      <Description :description="$t('loginClassCode.DESCRIPTION')" />
      <v-flex xs12 sm6 offset-sm3>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(submit)">
            <v-layout column>
              <v-flex>
                <ValidationProvider rules="required|min:10" v-slot="{ errors }">
                  <v-text-field
                    id="code"
                    name="code"
                    type="text"
                    :label="$t('loginClassCode.CLASS_CODE')"
                    v-model="code"
                    :error="errors.length > 0"
                    :error-messages="errors[0]"
                    autocomplete="off"
                  ></v-text-field>
                </ValidationProvider>
              </v-flex>
              <v-flex>
                <ValidationProvider rules="required|min:9" v-slot="{ errors }">
                  <v-text-field
                    id="phone"
                    name="phone"
                    type="text"
                    :label="$t('loginClassCode.PHONE')"
                    v-model="phone"
                    :error="errors.length > 0"
                    :error-messages="errors[0]"
                    autocomplete="off"
                  ></v-text-field>
                </ValidationProvider>
              </v-flex>
              <v-flex text-xs-center mt-5 mb-3>
                <SubmitButton :buttonText="$t('loginClassCode.SUBMIT')" />
              </v-flex>
              <v-flex text-xs-center>
                <v-btn
                  :to="{ name: 'contact' }"
                  small
                  text
                  class="btnForgotPassword"
                  >{{ $t('loginClassCode.FORGOT_CLASS_CODE') }}</v-btn
                >
              </v-flex>
            </v-layout>
          </form>
        </ValidationObserver>
      </v-flex>
      <ErrorMessage />
    </v-layout>
  </v-container>
</template>

<script>
import router from '@/router'
import { mapActions } from 'vuex'

export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('loginClassCode.TITLE')} - %s`
    }
  },
  data() {
    return {
      code: '',
      phone: ''
    }
  },
  methods: {
    ...mapActions(['loginClassCode']),
    async submit() {
      await this.loginClassCode({
        code: this.code.trim(),
        phone: this.phone.trim()
      })
    }
  },
  created() {
    if (this.$store.state.auth.isTokenSet) {
      router.push({ name: 'home' })
    }
  }
}
</script>
