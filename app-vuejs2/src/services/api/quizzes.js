import axios from 'axios'

export default {
  attempt(quizId) {
    return axios.post(`/api/quiz/attempt?quizId=${quizId}`)
  },
  getAttemptData(attemptId) {
    return axios.get(`/api/quiz/questions?attemptId=${attemptId}`)
  },
  getAttempts(quizId) {
    return axios.get(`/api/quiz/attempts?quizId=${quizId}`)
  },
  getResult(attemptId) {
    return axios.get(`/api/quiz/result?attemptId=${attemptId}`)
  },
  getQuizzes() {
    return axios.get('/api/quiz/quizzes')
  },
  submitAttempt(payload) {
    return axios.post('/api/quiz/submit', payload)
  }
}
