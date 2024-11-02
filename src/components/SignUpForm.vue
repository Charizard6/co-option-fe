<template>
  <div class="signup-container">
    <div class="signup-form">
      <h2>회원가입</h2>

      <div class="form-group">
        <label>이름</label>
        <input v-model="name" type="text" placeholder="이름을 입력하세요" />
      </div>

      <div class="form-group">
        <label>아이디</label>
        <div class="email-check-wrapper">
          <input v-model="id" type="email" placeholder="아이디를 입력하세요" />
          <button class="email-check-button" @click="checkEmail">아이디 확인</button>
        </div>
      </div>

      <div class="form-group">
        <label>비밀번호</label>
        <input v-model="password" type="password" placeholder="비밀번호를 입력하세요" />
      </div>

      <button @click="submitSignup">회원가입</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUpForm',
  data() {
    return {
      name: '',
      id: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async submitSignup() {
      try {
        const response = await fetch('http://localhost:9001/coOption/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: this.name,
            userId: this.id,
            userPwd: this.password
          })
        })
        if (response.ok) {
          alert('가입 성공')
          this.$router.push('/login-form')
        } else {
          alert('가입 실패')
        }
      } catch (error) {
        alert('rkdlq 요청 중 오류가 발생했습니다.')
      }
    }
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.signup-form {
  width: 400px;
  padding: 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.signup-form h2 {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-group label {
  width: 100px;
  margin-right: 10px;
  font-weight: bold;
  text-align: right;
}

.form-group input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

/* 이메일 확인 버튼과 이메일 입력 필드 정렬 */
.email-check-wrapper {
  display: flex;
  align-items: center;
}

.email-check-wrapper input {
  flex-grow: 1;
}

.email-check-button {
  margin-left: 10px;
  margin-bottom: 7%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.email-check-button:hover {
  background-color: #0069d9;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
