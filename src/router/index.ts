import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Window from '@/views/Window.vue'
// 个人首页
import StudentMe from '@/views/me/StudentMe.vue'
import TeacherMe from '@/views/me/TeacherMe.vue'
import AdminMe from '@/views/me/AdminMe.vue'
// 班级
import AdminClass from '@/views/class/AdminClass.vue'
import StudentClass from '@/views/class/StudentClass.vue'
import TeacherClass from '@/views/class/TeacherClass.vue'
// 实验
import StudentExperiment from '@/views/experiment/StudentExperiment.vue'
// 报告
import StudentReport from '@/views/report/StudentReport.vue'
import TeacherReport from '@/views/report/TeacherReport.vue'
// 考试
import ExamArrange from '@/views/exam/ExamArrange.vue'
import ExamResult from '@/views/exam/ExamResult.vue'
import ExamPaperDetail from '@/views/exam/ExamPaperDetail.vue'
// 教务管理
import UserManage from '@/views/manage/UserManage.vue'
import EducationManage from '@/views/manage/EducationManage.vue'
import CourseManage from '@/views/manage/CourseManage.vue'
import ExamManage from '@/views/manage/ExamManage.vue'
import ExperimentManage from '@/views/manage/ExperimentManage.vue'

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
          path: '/studentMe',
          name: 'studentMe',
          component: StudentMe
        },
        {
          path: '/teacherMe',
          name: 'teacherMe',
          component: TeacherMe
        },
        {
          path: '/adminMe',
          name: 'adminMe',
          component: AdminMe
        },
        {
          path: '/studentClass',
          name: 'studentClass',
          component: StudentClass
        },
        {
          path: '/adminClass',          
          name: 'adminClass',
          component: AdminClass
        },
        {
          path: '/teacherClass',          
          name: 'teacherClass',
          component: TeacherClass
        },
        {
          path: '/studentExperiment',          
          name: 'studentExperiment',
          component: StudentExperiment
        },
        // 考试
        {
          path: '/examArrange',          
          name: 'examArrange',
          component: ExamArrange
        },
        {
          path: '/examResult',          
          name: 'examResult',
          component:ExamResult
        },
        {
          path: '/examPaperDetail/',          
          name: 'examPaperDetail',
          component: ExamPaperDetail
        },
        // 报告
        {
          path: '/teacherReport',          
          name: 'teacherReport',
          component: TeacherReport
        },
        {
          path: '/studentReport',          
          name: 'studentReport',
          component: StudentReport
        },
        // 教务管理
        {
          path: '/userManage',          
          name: 'userManage',
          component: UserManage
        },
        {
          path: '/educationManage',          
          name: 'educationManage',
          component: EducationManage
        },
        {
          path: '/courseManage',          
          name: 'courseManage',
          component: CourseManage
        },
        {
          path: '/examManage',          
          name: 'examManage',
          component: ExamManage
        },
        {
          path: '/experimentManage',          
          name: 'experimentManage',
          component: ExperimentManage
        }
      ]
    }
  ]
})

export default router
