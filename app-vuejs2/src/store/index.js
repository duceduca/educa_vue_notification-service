import Vue from 'vue'
import Vuex from 'vuex'
import modules from '@/store/modules'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    ...modules
  },
  mutations: {
    initialiseStore(state) {
      // console.info(`(initialiseStore)state: ${JSON.stringify(state)}`)
      // Check if the ID exists
      if (window.localStorage.getItem('store')) {
        const storedState = window.localStorage.getItem('store')
        // console.info(
        //   `(initialiseStore)storedState: ${JSON.stringify(storedState)}`
        // )
        // const storedUser = window.localStorage.getItem('user')
        // console.info(
        //   `(initialiseStore)storedUser: ${JSON.stringify(storedUser)}`
        // )
        // Replace the state object with the stored item
        this.replaceState(Object.assign(state, JSON.parse(storedState)))
      }
    }
  }
})

// Subscribe to store updates
store.subscribe((mutation, state) => {
  // console.info(`(subscribe)mutation: ${JSON.stringify(mutation)}`)
  // console.info(`(subscribe)state: ${JSON.stringify(state)}`)
  // Store the state object as a JSON string
  if (mutation.payload !== null || mutation.type === 'initialiseStore') {
    // console.info(`(subscribe)store data to localstorage`)
    localStorage.setItem('store', JSON.stringify(state))
  }
})

if (window.Cypress) {
  // Only available during E2E tests
  window.__store__ = store
}
