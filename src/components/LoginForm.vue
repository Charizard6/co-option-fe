<template>
  <div class="login-container">
    <div class="login-form">
      <h2>로그인</h2>

      <div class="form-group">
        <label>아이디</label>
        <input v-model="userId" type="text" placeholder="아이디를 입력하세요" />
      </div>

      <div class="form-group">
        <label>비밀번호</label>
        <input v-model="userPwd" type="password" placeholder="비밀번호를 입력하세요" />
      </div>

      <div class="button-group">
        <button @click="submitForm" class="login-button">로그인</button>
        <button @click="goToSignup" class="signup-button">회원가입</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'loginForm',
  data() {
    return {
      userId: '',
      userPwd: ''
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    async submitForm() {
      try {
        const response = await fetch('http://localhost:9001/coOption/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: this.userId,
            userPwd: this.userPwd
          })
        })

        if (response.ok) {
          const data = await response.json()
          this.setUser(data) // Vuex에 사용자 정보 저장
          alert('로그인 성공')
          this.$router.push('/') // 로그인 성공 시 홈으로 이동
        } else {
          alert('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.')
        }
      } catch (error) {
        console.error('로그인 요청 중 오류 발생:', error)
        alert('로그인 요청 중 오류가 발생했습니다.')
      }
    },
    goToSignup() {
      this.$router.push('/signup-form')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  width: 300px;
  padding: 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-form h2 {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  gap: 10px; /* 버튼 간격 조절 */
}

.login-button {
  flex: 1;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #45a049;
}

.signup-button {
  flex: 1;
  padding: 10px;
  background-color: #007bff; /* 파란색으로 설정 */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.signup-button:hover {
  background-color: #0069d9; /* 호버 시 더 진한 파란색 */
}
</style>
