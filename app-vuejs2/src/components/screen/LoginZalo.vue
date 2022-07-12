<template>
  <v-container fluid>
    <v-layout row wrap>
      <Heading :title="$t('loginClassCode.TITLE_ZALO')" />
      <Description :description="$t('loginClassCode.DESCRIPTION')" />
      <v-flex xs12 sm6 offset-sm3>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(submit)">
            <v-layout column>
              <v-flex>
                <ValidationProvider rules="required|min:1" v-slot="{ errors }">
                  <v-text-field
                    name="userName"
                    type="text"
                    :label="$t('loginClassCode.USER_NAME')"
                    v-model="userName"
                    :error="errors.length > 0"
                    :error-messages="errors[0]"
                    autocomplete="off"
                  ></v-text-field>
                </ValidationProvider>
              </v-flex>
              <v-flex>
                <ValidationProvider rules="required|min:1" v-slot="{ errors }">
                  <v-text-field
                    name="password"
                    type="password"
                    :label="$t('loginClassCode.PASSWORD')"
                    v-model="password"
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
      userName: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['loginZalo']),
    async submit() {
      await this.loginZalo({
        userName: this.userName.trim(),
        password: this.password.trim()
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
