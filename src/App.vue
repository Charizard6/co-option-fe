<template>
  <div id="app">
    <NavigationBar />
    <!-- 여기서 라우터 뷰를 사용하여 라우트에 따라 화면이 바뀌게 합니다. -->
    <router-view class="router-view"></router-view>
  </div>
</template>

<script>
import NavigationBar from './components/Navigation.vue'
export default {
  name: 'App',
  components: {
    NavigationBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
/* <router-view> 아래 내용이 네비게이션 바 뒤로 가도록 여백 추가 */
.router-view {
  margin-top: 40px; /* 네비게이션 바 크기만큼 여백 추가 */
}
</style>
