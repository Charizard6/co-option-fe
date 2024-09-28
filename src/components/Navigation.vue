<template>
  <nav class="navbar">
    <!-- 로고 영역 -->
    <div class="logo">Co-Option</div>

    <!-- 네비게이션 링크 -->
    <ul class="nav-links">
      <li><button @click="goToSignUpForm">회원가입</button></li>
      <li><button @click="goToLoginForm">로그인</button></li>
      <li><button @click="goToRequestedBox">요청함</button></li>
      <li><button @click="goToCalendar">캘린더</button></li>
      <li><button @click="goToTaskManager">업무 관리자</button></li>
    </ul>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NavigationBar',
  setup() {
    const router = useRouter()

    const goToRequestedBox = () => router.push('/requested-box')
    const goToCalendar = () => router.push('/calendar-page')
    const goToLoginForm = () => router.push('/login-form')
    const goToSignUpForm = () => router.push('/signup-form')
    const goToTaskManager = () => router.push('/task-manager')

    return {
      goToRequestedBox,
      goToCalendar,
      goToLoginForm,
      goToSignUpForm,
      goToTaskManager
    }
  }
}
</script>

<style>
/* 네비게이션 바 기본 스타일 */
.navbar {
  background-color: white;
  padding: 20px 0;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding-bottom: 0;
}

/* 로고 스타일 */
.logo {
  font-size: 24px;
  font-weight: bold;
  color: black;
  margin-bottom: 5px;
}

/* 네비게이션 링크 초기 상태 */
.nav-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
  opacity: 0; /* 초기 상태에서 보이지 않도록 설정 */
  transform: translateY(-50%); /* 위쪽에 숨겨둠 */
  transition:
    transform 0.5s ease,
    opacity 0.5s ease; /* 부드러운 애니메이션 설정 */
}
.nav-links button {
  margin: 0;
  padding: 0;
}

/* 마우스를 올렸을 때 네비게이션 항목이 내려옴 */
.navbar:hover .nav-links {
  opacity: 1; /* 서서히 보이게 설정 */
  transform: translateY(5%); /* 위에서 아래로 내려옴 */
}

/* 각 항목 중앙 정렬 */
.nav-links li {
  flex: 1;
  text-align: center;
}

/* 버튼 기본 스타일 */
.nav-links button {
  background: none;
  border: none;
  font-weight: bold;
  color: rgb(76, 76, 76);
  font-size: 16px;
  cursor: pointer;
}

/* 버튼 호버 시 밑줄 추가 */
.nav-links button:hover {
  background: none;
  text-decoration: underline;
}
</style>
