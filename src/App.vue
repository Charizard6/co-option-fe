<template>
  <div id="app">
    <!-- 여기서 라우터 뷰를 사용하여 라우트에 따라 화면이 바뀌게 합니다. -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
