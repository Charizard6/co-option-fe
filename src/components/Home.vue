<template>
  <div>
    <h1>Home Page</h1>
    <button @click="goToLoginForm">Go to LoginPage</button>
    <button @click="goToRequestedBox">Go to Requested Box</button>
    <button @click="goToCalendar">Go to Calendar</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'HomeVue',
  setup() {
    const router = useRouter()

    const goToRequestedBox = () => {
      router.push('/requested-box')
    }
    const goToCalendar = () => {
      router.push('/calendar-page')
    }
    const goToLoginForm = () => {
      router.push('/login-form')
    }

    return {
      goToRequestedBox,
      goToCalendar,
      goToLoginForm
    }
  }
}
</script>

<style>
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
