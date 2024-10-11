import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Forget from '@/views/Forget.vue'
// 实验
import Experiment from '@/views/experiment/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'newlogin',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/forget',
      name: 'forget',
      component: Forget
    },
    {
      path: '/experiment',
      name: 'experiment',
      component: Experiment
    }
  ]
})

export default router
