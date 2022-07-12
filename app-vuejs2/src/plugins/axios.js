import Vue from 'vue'
import axios from 'axios'
import { checkIfTokenNeedsRefresh } from '@/utils/utils'
import { checkForUpdates } from '@/utils/updates'

axios.defaults.baseURL = process.env.VUE_APP_API_URL || ''
axios.defaults.headers.common['Accept-Language'] =
  JSON.parse(localStorage.getItem('locale')) || 'vi'

axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent

    // If request is different than any of the URLS in urlsExcludedForBearerHeader
    // then send Authorization header with token from localstorage
    const urlsExcludedForBearerHeader = [
      '/api/public/login',
      '/api/public/login-class-code',
      '/api/public/login-token',
      '/api/public/refresh-token',
      '/api/public/register',
      '/reset',
      `${window.location.origin}/version.json`
    ]
    if (urlsExcludedForBearerHeader.indexOf(config.url) === -1) {
      config.headers.Authorization = `${JSON.parse(
        localStorage.getItem('token')
      )}`
    }

    // Check if token is needed to refresh or not
    const refreshUrl = `/api/public/refresh-token?token=${localStorage.getItem(
      'refreshToken'
    )}`
    if (config.url !== `${process.env.VUE_APP_API_URL}${refreshUrl}`) {
      checkIfTokenNeedsRefresh()
    }

    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    // Checks if app is being used in mobile
    if (response.config.url !== `${window.location.origin}/version.json`) {
      checkForUpdates()
    }
    return response
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error)
  }
)

// eslint-disable-next-line no-shadow
Plugin.install = (Vue) => {
  Vue.axios = axios
  window.axios = axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return axios
      }
    },
    $axios: {
      get() {
        return axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
