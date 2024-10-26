import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

let logoutTimer // 로그아웃 타이머 변수

export default createStore({
  state: {
    user: {
      userId: null,
      userName: null,
      userSeq: null
    },
    sessionTimeout: 30 * 60 * 1000 // 세션 제한 시간 (30분)
  },
  mutations: {
    setUser(state, _user) {
      state.user = _user
      // 세션 만료 시간을 설정하여 sessionStorage에 저장
      const expireTime = Date.now() + state.sessionTimeout
      sessionStorage.setItem('sessionExpireTime', expireTime)
    },
    clearUser(state) {
      state.user = {
        userId: null,
        userName: null,
        userSeq: null
      }
      sessionStorage.removeItem('sessionExpireTime') // 만료 시간 제거
    },
    setLogoutTimer(state, timer) {
      logoutTimer = timer
    },
    clearLogoutTimer() {
      if (logoutTimer) {
        clearTimeout(logoutTimer)
        logoutTimer = null
      }
    }
  },
  actions: {
    startSessionTimer({ dispatch, commit, state }) {
      // 기존 타이머가 있다면 초기화
      commit('clearLogoutTimer')

      // 세션 만료 시간 가져오기
      const expireTime = sessionStorage.getItem('sessionExpireTime')
      const remainingTime = expireTime ? expireTime - Date.now() : state.sessionTimeout

      if (remainingTime > 0) {
        // 남은 시간만큼 타이머 설정
        const timer = setTimeout(() => {
          dispatch('autoLogout') // 시간이 초과되면 자동 로그아웃
        }, remainingTime)

        commit('setLogoutTimer', timer)
      } else {
        // 남은 시간이 없으면 바로 로그아웃
        dispatch('autoLogout')
      }
    },
    autoLogout({ commit }) {
      commit('clearUser')
      commit('clearLogoutTimer')
      sessionStorage.clear() // 세션 스토리지 초기화
      // 라우팅 처리
      window.location.href = '/login-form' // 로그인 화면으로 이동
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
