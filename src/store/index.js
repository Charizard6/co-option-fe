// store/index.js
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    user: {
      id: null,
      userId: null,
      userName: null
    }
  },
  mutations: {
    setUser(state, _user) {
      state.user = _user
      //localStorage.setItem('user', JSON.stringify(_user));
    },
    clearUser(state) {
      state.user = null
    }
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage // 세션 유지 (localStorage로 변경하면 브라우저가 닫혀도 유지)
    })
  ]
})
