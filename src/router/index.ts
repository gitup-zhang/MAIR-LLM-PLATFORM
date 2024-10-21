import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Window from '@/views/Window.vue'
import Me from '@/views/Me.vue'
import Course from '@/views/course/index.vue'
// 实验
import Experiment from '@/views/experiment/index.vue'
import ExperimentConduct from '@/views/experiment/ExperimentConduct.vue'
// 课程报告
import StuCourseReport from '@/views/course/StuCourseReport.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'newlogin',
      component: Login
    },
    {
      path: '/window',
      name: 'window',
      component: Window,
      children: [
        {
          path: '/experiment',
          name: 'experiment',
          component: Experiment
        },
        {
          path: '/experimentConduct',
          name: 'experimentConduct',
          component: ExperimentConduct
        },
        {
          path: '/stuCourseReport',
          name: 'stuCourseReport',
          component: StuCourseReport
        },
        {
          path: '/me',
          name: 'me',
          component: Me
        },
        {
          path: '/course',
          name: 'course',
          component: Course
        },
      ]
    }
  ]
})

export default router
