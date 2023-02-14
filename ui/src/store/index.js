import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: localStorage.hasOwnProperty("token") ? true : false,
    user: null,
    userId: null,
    isAdmin: localStorage.getItem("isAdmin") ? true : false
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
