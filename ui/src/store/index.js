import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: localStorage.hasOwnProperty("token") ? true : false,
    user: null,
    userId: null,
    isAdmin: localStorage.getItem("isAdmin") ? true : false
  },
  getters: {
    // getUser: state => {
    //   console.log('Retrieving user...')
    //   return state.user;
    // }
  },
  mutations: {
    // SET_AUTH: (state, status) => {
    //   state.isAuthenticated = status
    // },
    // setUser(state, user) {
    //   state.user = user;
    //   console.log("User set in store");
    // },
    // setUserId(state, userId) {
    //   state.userId = userId;
    //   console.log("User ID set in store");
    // }
  },
  actions: {
    // login: ({ commit }, payload) => {
    //   commit('SET_AUTH', payload)
    // },
    // admin: ({ commit }, payload) => {
    //   commit('ADMIN', payload)
    // }
    // login: ({ commit }, payload) => {
    //   commit('SET_AUTH', payload)
    //   store.commit('setUserId', response.userId);
    // }
  },
  modules: {
  }
})
