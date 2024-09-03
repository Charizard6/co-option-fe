import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import RequestedBox from '../components/RequestedBox.vue'
import CalendarPage from '../components/DemoApp.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
