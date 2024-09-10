<template>
  <div class="login-container">
    <div class="login-form">
      <h2>로그인</h2>

      <div class="form-group">
        <label>아이디</label>
        <input type="text" placeholder="아이디를 입력하세요" />
      </div>

      <div class="form-group">
        <label>비밀번호</label>
        <input type="password" placeholder="비밀번호를 입력하세요" />
      </div>

      <button @click="submitForm">로그인</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginForm',
  methods: {
    submitForm() {
      // 로그인 로직을 여기에 추가하세요.
      console.log('로그인 시도')
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
