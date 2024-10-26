import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    user: {
      userId: null,
      userName: null,
      userSeq: null
    }
  },
  mutations: {
    setUser(state, _user) {
      state.user = _user
    },
    clearUser(state) {
      state.user = {
        userId: null,
        userName: null,
        userSeq: null
      }
    }
  },
  actions: {
    logout({ commit }, router) {
      commit('clearUser')
      sessionStorage.clear() // 세션 스토리지 초기화
    }
  },
  getters: {
    isLoggedIn: (state) => {
      return state.user.userId !== null
    },
    getUser: (state) => state.user.userId,
    getUserSeq: (state) => state.user.userSeq,
    getUserName: (state) => state.user.userName
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage // 세션 유지 (localStorage로 변경하면 브라우저가 닫혀도 유지)
    })
  ]
})
