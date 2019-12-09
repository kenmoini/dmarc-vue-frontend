import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
//import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SET_USER_DATA (state, userData) {
      state.user = userData.keycloakReturn
      if (userData.keycloakReturn.authenticated){
        localStorage.setItem('user', JSON.stringify(userData.keycloakReturn))
        axios.defaults.headers.common['Authorization'] = `Bearer ${
          userData.keycloakReturn.token
        }`
      }
    },
    CLEAR_USER_DATA () {
      localStorage.removeItem('user')
      Vue.prototype.$keycloak.logoutFn()
    }
  },
  actions: {
    login ({ commit }, keycloakReturn) {
      commit('SET_USER_DATA', keycloakReturn)
    },
    logout ({ commit }) {
      commit('CLEAR_USER_DATA')
    }
  },
  modules: {
  },
  getters: {
    loggedIn (state) {
      if (state.user) {
        return !!state.user.authenticated
      }
      return false
    }
  }
})
