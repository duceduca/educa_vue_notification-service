import * as types from '@/store/mutation-types'
import router from '@/router'
import api from '@/services/api/auth'
import { store, remove, updateToken } from '@/utils/storages'
import { buildSuccess, handleError } from '@/utils/utils'

const getters = {
  user: (state) => state.user,
  token: (state) => state.token,
  isTokenSet: (state) => state.isTokenSet
}

const actions = {
  autoLogin({ commit }) {
    const user = JSON.parse(localStorage.getItem('user'))
    commit(types.SAVE_USER, user)
    commit(types.SAVE_TOKEN, JSON.parse(localStorage.getItem('token')))
    commit(types.SET_LOCALE, JSON.parse(localStorage.getItem('locale')))
  },
  login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .login(payload)
        .then((response) => {
          if (response.status === 200) {
            store(response.data)
            commit(types.SAVE_USER, response.data.user)
            commit(types.SAVE_TOKEN, response.data.accessToken)
            buildSuccess(
              null,
              commit,
              resolve,
              router.push({
                name: 'home'
              })
            )
          }
        })
        .catch((error) => {
          console.error(`(userLogin)error: ${error.message}`)
          handleError(error, commit, reject)
        })
    })
  },
  loginClassCode({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .loginClassCode(payload)
        .then((response) => {
          if (response.status === 200) {
            store(response.data)
            commit(types.SAVE_USER, response.data.user)
            commit(types.SAVE_TOKEN, response.data.accessToken)
            buildSuccess(
              null,
              commit,
              resolve,
              router.push({
                name: 'home'
              })
            )
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  loginToken({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .loginToken(payload)
        .then((response) => {
          if (response.status === 200) {
            store(response.data)
            commit(types.SAVE_USER, response.data.user)
            commit(types.SAVE_TOKEN, response.data.accessToken)
            buildSuccess(
              null,
              commit,
              resolve,
              router.push({
                name: 'home'
              })
            )
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  loginZalo({ commit }, payload) {
    console.log(commit)
    console.log(payload)
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .loginZalo(payload)
        .then((response) => {
          if (response.status === 200) {
            store(response.data)
            commit(types.SAVE_USER, response.data.user)
            commit(types.SAVE_TOKEN, response.data.accessToken)
            buildSuccess(
              null,
              commit,
              resolve,
              router.push({
                name: 'home'
              })
            )
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  refreshToken({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .refreshToken()
        .then((response) => {
          if (response.status === 200) {
            updateToken(response.data)
            commit(types.SAVE_TOKEN, response.data.token)
            resolve()
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  userLogout({ commit }) {
    remove()
    commit(types.LOGOUT)
    router.push({
      name: 'login'
    })
  }
}

const mutations = {
  [types.SAVE_TOKEN](state, token) {
    state.token = token
    state.isTokenSet = true
  },
  [types.LOGOUT](state) {
    state.user = null
    state.token = null
    state.isTokenSet = false
  },
  [types.SAVE_USER](state, user) {
    state.user = user
  }
}

const state = {
  user: null,
  token: JSON.parse(!!localStorage.getItem('token')) || null,
  isTokenSet: !!localStorage.getItem('token')
}

export default {
  state,
  getters,
  actions,
  mutations
}
