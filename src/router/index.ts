import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'newlogin',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/window',
      name: 'window',
      component: () => import('@/views/Window.vue'),
      children: [
        {
          path: '/studentMe',
          name: 'studentMe',
          component: () => import('@/views/me/StudentMe.vue'),
        },
        {
          path: '/teacherMe',
          name: 'teacherMe',
          component: () => import('@/views/me/TeacherMe.vue'),
        },
        {
          path: '/adminMe',
          name: 'adminMe',
          component: import('@/views/me/AdminMe.vue'),
        },
        {
          path: '/studentClass',
          name: 'studentClass',
          component: () => import('@/views/class/StudentClass.vue'),
        },
        {
          path: '/adminClass',
          name: 'adminClass',
          component: () => import('@/views/class/AdminClass.vue'),
        },
        {
          path: '/teacherClass',
          name: 'teacherClass',
          component: () => import('@/views/class/TeacherClass.vue'),
        },
        {
          path: '/studentExperiment',
          name: 'studentExperiment',
          component: () => import('@/views/experiment/StudentExperiment.vue'),
        },
        {
          path: '/experimentIndex',
          name: 'experimentIndex',
          component: () => import('@/views/experiment/ExperimentIndex.vue'),
        },
        // 考试
        {
          path: '/examArrange',
          name: 'examArrange',
          component: () => import('@/views/exam/ExamArrange.vue'),
        },
        {
          path: '/examResult',
          name: 'examResult',
          component: () => import('@/views/exam/ExamResult.vue'),
        },
        {
          path: '/examPaperDetail/',
          name: 'examPaperDetail',
          component: () => import('@/views/exam/ExamPaperDetail.vue'),
        },
        // 报告
        {
          path: '/teacherReport',
          name: 'teacherReport',
          component: () => import('@/views/report/TeacherReport.vue'),
        },
        {
          path: '/studentReport',
          name: 'studentReport',
          component: () => import('@/views/report/StudentReport.vue'),
        },
        // 教务管理
        {
          path: '/userManage',
          name: 'userManage',
          component: () => import('@/views/manage/UserManage.vue'),
        },
        {
          path: '/educationManage',
          name: 'educationManage',
          component: () => import('@/views/manage/EducationManage.vue'),
        },
        {
          path: '/courseManage',
          name: 'courseManage',
          component: () => import('@/views/manage/CourseManage.vue'),
        },
        {
          path: '/examManage',
          name: 'examManage',
          component: () => import('@/views/manage/ExamManage.vue'),
        },
        {
          path: '/experimentManage',
          name: 'experimentManage',
          component: () => import('@/views/manage/ExperimentManage.vue'),
        }
      ]
    }
  ]
})

export default router
