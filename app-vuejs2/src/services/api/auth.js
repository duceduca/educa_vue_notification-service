import axios from 'axios'

export default {
  login(payload) {
    return axios.post('/api/public/login', payload)
  },
  loginClassCode(payload) {
    return axios.post('/api/public/login-class-code', payload)
  },
  loginToken(payload) {
    return axios.post('/api/public/login-token', payload)
  },
  loginZalo(payload) {
    return axios.post('/api/login/user-name', payload)
  },
  refreshToken() {
    return axios.get('/api/public/refresh-token')
  }
}
