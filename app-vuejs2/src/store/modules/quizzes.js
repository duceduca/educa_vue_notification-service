import * as types from '@/store/mutation-types'
import router from '@/router'
import api from '@/services/api/quizzes'
import { buildSuccess, handleError } from '@/utils/utils'

const getters = {
  attemptsAnswers: (state) => state.attemptsAnswers,
  attemptsData: (state) => state.attemptsData,
  attemptsResult: (state) => state.attemptsResult,
  quizAttempts: (state) => state.quizAttempts,
  recentAttemptId: (state) => state.recentAttemptId,
  quizzes: (state) => state.quizzes
}

const actions = {
  attempt({ commit }, quizId) {
    return new Promise((resolve, reject) => {
      api
        .attempt(quizId)
        .then((response) => {
          if (response.status === 200) {
            commit(types.ATTEMPT, response.data)
            buildSuccess(
              {
                msg: 'quiz.ATTEMPT_SUCCESSFULLY'
              },
              commit,
              resolve,
              router.push({
                name: 'student-attempt',
                params: { id: response.data.id }
              })
            )
          }
        })
        .catch((error) => {
          console.debug(`(attempt)error: ${error.message}`)
          handleError(error, commit, reject)
        })
    })
  },
  getAttempts({ commit, dispatch }, quizId) {
    return new Promise((resolve, reject) => {
      api
        .getAttempts(quizId)
        .then((response) => {
          if (response.status === 200) {
            if (response.data.length === 0) {
              dispatch('attempt', quizId).then(() => {
                console.debug(`(getAttempts)process attempt`)
              })
            } else {
              commit(types.ATTEMPTS, { quizId, attempts: response.data })
            }
            resolve()
          }
        })
        .catch((error) => {
          console.debug(`(getAttempts)error: ${error.message}`)
          handleError(error, commit, reject)
        })
    })
  },
  getResult({ commit }, attemptId) {
    return new Promise((resolve, reject) => {
      api
        .getResult(attemptId)
        .then((response) => {
          if (response.status === 200) {
            commit(types.ATTEMPTS_RESULT, response.data)
            resolve()
          }
        })
        .catch((error) => {
          console.debug(`(getResult)error: ${error.message}`)
          handleError(error, commit, reject)
        })
    })
  },
  getAttemptData({ commit }, attemptId) {
    return new Promise((resolve, reject) => {
      api
        .getAttemptData(attemptId)
        .then((response) => {
          if (response.status === 200) {
            commit(types.ATTEMPTS_DATA, { attemptId, data: response.data })
            resolve()
          }
        })
        .catch((error) => {
          console.debug(`(getAttemptData)error: ${error.message}`)
          handleError(error, commit, reject)
        })
    })
  },
  getQuizzes({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getQuizzes()
        .then((response) => {
          if (response.status === 200) {
            commit(types.QUIZZES, response.data)
            resolve()
          }
        })
        .catch((error) => {
          console.debug(`(getQuizzes)error: ${error.message}`)
          handleError(error, commit, reject)
        })
    })
  },
  resetAttempt({ commit }) {
    return new Promise((resolve) => {
      commit(types.ATTEMPT_RESET)
      resolve()
    })
  },
  setAnswersData({ commit }, data) {
    // console.info(`(setAnswersData)data: ${JSON.stringify(data)}`)
    return new Promise((resolve) => {
      commit(types.ATTEMPTS_ANSWERS, data)
      resolve()
    })
  },
  submit({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .submitAttempt(payload)
        .then((response) => {
          if (response.status === 200) {
            buildSuccess(
              {
                msg: 'quizAttempt.SUBMIT_SUCCESSFULLY'
              },
              commit,
              resolve,
              router.push({
                name: 'student-attempt-result',
                params: { id: payload.attemptId }
              })
            )
          }
          commit(types.SHOW_LOADING, false)
        })
        .catch((error) => {
          handleError(error, commit, reject)
        })
    })
  }
}

const mutations = {
  [types.ATTEMPT](state, attempt) {
    state.recentAttemptId = attempt.id
  },

  [types.ATTEMPT_RESET](state) {
    state.recentAttemptId = -1
  },

  [types.ATTEMPTS](state, data) {
    // console.info(`(store-quizzes)data: ${data}`)
    const oldData = state.quizAttempts
    oldData.splice(
      oldData.findIndex((e) => e.quizId === data.quizId),
      1
    )
    oldData.push(data)
    state.quizAttempts = oldData
  },

  [types.ATTEMPTS_ANSWERS](state, data) {
    const oldData = state.attemptsAnswers
    oldData.splice(
      oldData.findIndex((e) => e.attemptId === data.attemptId),
      1
    )
    oldData.push(data)
    state.attemptsAnswers = oldData
  },

  [types.ATTEMPTS_DATA](state, data) {
    // console.info(`(store-quizzes_ATTEMPTS_DATA)data: ${JSON.stringify(data)}`)
    const oldData = state.attemptsData
    oldData.splice(
      oldData.findIndex((e) => e.attemptId === data.attemptId),
      1
    )
    oldData.push(data)
    state.attemptsData = oldData
  },

  [types.ATTEMPTS_RESULT](state, data) {
    const oldData = state.attemptsResult
    oldData.splice(
      oldData.findIndex((e) => e.attemptId === data.attemptId),
      1
    )
    oldData.push(data)
    state.attemptsResult = oldData
  },

  [types.QUIZZES](state, quizzes) {
    state.quizzes = quizzes
  }
}

const state = {
  // format: { attemptId: 1, answers: [] }
  attemptsAnswers: [],

  // format: { attemptId: 1, data: { attempt: {}, questions: [], quiz: {} } }
  attemptsData: [],

  // format: { attemptId: 1, result: {} }
  attemptsResult: [],

  // format: { quizId: 1, attempts: [] }
  quizAttempts: [],

  // last attempt's id
  recentAttemptId: -1,

  quizzes: []
}

export default {
  state,
  getters,
  actions,
  mutations
}
