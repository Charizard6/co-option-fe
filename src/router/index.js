import { createRouter, createWebHistory } from 'vue-router'
import RequestedBox from '../components/RequestedBox.vue'
import CalendarPage from '../components/DemoApp.vue'
import LoginForm from '@/components/LoginForm.vue'
import SignUpForm from '@/components/SignUpForm.vue'
import TaskManager from '@/components/TaskManager.vue'
import store from '@/store/index.js'
import AccountApp from '@/components/AccountApp.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CalendarPage,
    meta: { auth: true }
  },
  {
    path: '/requested-box',
    name: 'RequestedBox',
    component: RequestedBox,
    meta: { auth: true }
  },
  {
    path: '/calendar-page',
    name: 'CalendarPage',
    component: CalendarPage,
    meta: { auth: true }
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
  },
  {
    path: '/task-manager',
    name: 'TaskManager',
    component: TaskManager,
    meta: { auth: true }
  },
  {
    path: '/account-app',
    name: 'AccountApp',
    component: AccountApp,
    meta: { auth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userId = store.state?.user?.userId
  console.log(userId)
  if (to.matched.some((r) => r.meta.auth) && userId == null) {
    alert('로그인이 필요한 페이지입니다!')
    if (to.path !== '/login-form') {
      next('/login-form')
    } else {
      next() // 로그인 페이지일 경우 그대로 진행
    }
  } else {
    next() // 그 외의 경우는 정상적으로 진행
  }
})

export default router
