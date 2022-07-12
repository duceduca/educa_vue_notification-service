import axios from 'axios'

export default {
  changeMyPassword(payload) {
    return axios.post('/api/profile/changePassword', payload)
  },
  getProfile() {
    return axios.get('/api/profile')
  },
  saveProfile(payload) {
    return axios.post('/api/profile', payload)
  }
}
