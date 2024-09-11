import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import RequestedBox from '../components/RequestedBox.vue'
import CalendarPage from '../components/DemoApp.vue'
import LoginForm from '@/components/LoginForm.vue'
import SignUpForm from '@/components/SignUpForm.vue'

const routes = [
  {
    path: '/',
    name: 'HomeVue',
    component: Home
  },
  {
    path: '/requested-box',
    name: 'RequestedBox',
    component: RequestedBox
  },
  {
    path: '/calendar-page',
    name: 'CalendarPage',
    component: CalendarPage
  },
  {
    path: '/login-form',
    name: 'LoginForm',
    component: LoginForm
  },
  {
    path: '/signup-form',
    name: 'SignUpForm',
    component: SignUpForm
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
