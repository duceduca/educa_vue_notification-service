import * as types from '@/store/mutation-types'
import api from '@/services/api/profile'
import { buildSuccess, handleError } from '@/utils/utils.js'

const getters = {
  profile: (state) => state.profile
}

const actions = {
  changeMyPassword({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .changeMyPassword(payload)
        .then((response) => {
          if (response.status === 200) {
            buildSuccess(
              {
                msg: 'myProfile.PASSWORD_CHANGED'
              },
              commit,
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  getProfile({ commit }) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .getProfile()
        .then((response) => {
          if (response.status === 200) {
            commit(types.FILL_PROFILE, response.data)
            buildSuccess(null, commit, resolve)
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  saveProfile({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .saveProfile(payload)
        .then((response) => {
          if (response.status === 200) {
            commit(types.FILL_PROFILE, response.data)
            buildSuccess(
              {
                msg: 'myProfile.PROFILE_SAVED_SUCCESSFULLY'
              },
              commit,
              resolve
            )
          }
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  },
  addProfileData({ commit }, data) {
    commit(types.ADD_PROFILE_DATA, data)
  }
}

const mutations = {
  [types.FILL_PROFILE](state, data) {
    state.profile.id = data.id
    state.profile.userName = data.userName
    state.profile.fullName = data.fullName
    state.profile.phone = data.phone
  },
  [types.ADD_PROFILE_DATA](state, data) {
    switch (data.key) {
      case 'id':
        state.profile.id = data.value
        break
      case 'userName':
        state.profile.userName = data.value
        break
      case 'fullName':
        state.profile.fullName = data.value
        break
      case 'phone':
        state.profile.phone = data.value
        break
      default:
        break
    }
  }
}

const state = {
  profile: {
    id: '',
    userName: '',
    fullName: '',
    phone: ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
