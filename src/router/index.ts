import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Window from '@/views/Window.vue'
// 个人首页
import StudentMe from '@/views/me/StudentMe.vue'
import TeacherMe from '@/views/me/TeacherMe.vue'
import AdminMe from '@/views/me/AdminMe.vue'
// 用户相关
import UserManage from '@/views/user/UserManage.vue'
// 考试
import ManageExam from '@/views/exam/ManageExam.vue'
// 实验
import ManageExperiment from '@/views/experiment/ManageExperiment.vue'
import StudentExperiment from '@/views/experiment/StudentExperiment.vue'
// 班级
import AdminClass from '@/views/class/AdminClass.vue'
import StudentClass from '@/views/class/StudentClass.vue'



// 课程
import Course from '@/views/course/index.vue'
import TeacherCourse from '@/views/course/TeacherCourse.vue'
import ManageCourse from '@/views/course/ManageCourse.vue'
// 实验
import Experiment from '@/views/experiment/index.vue'
import ExperimentConduct from '@/views/experiment/ExperimentConduct.vue'
import TeachExperiment from '@/views/experiment/TeachExperiment.vue'
// 课程报告
import StuCourseReport from '@/views/course/StuCourseReport.vue'
// 考试
import ClassExam from '@/views/exam/ClassExam.vue'
import ExamResult from '@/views/exam/ExamResult.vue'
import ExamPaperDetail from '@/views/exam/ExamPaperDetail.vue'
// 教务管理

import EducationWindow from '@/views/education/EducationWindow.vue'
import ManageCourseWindow from '@/views/course/ManageCourseWindow.vue'



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
          path: '/studentExperiment',          
          name: 'studentExperiment',
          component: StudentExperiment
        },





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
          path: '/teachExperiment',
          name: 'teachExperiment',
          component: TeachExperiment
        },
        {
          path: '/stuCourseReport',
          name: 'stuCourseReport',
          component: StuCourseReport
        },
        {
          path: '/course',
          name: 'course',
          component: Course
        },
        {
          path: '/teacherCourse',
          name: 'teacherCourse',
          component: TeacherCourse
        },
        {
          path: '/manageCourse',          
          name: 'manageCourse',
          component: ManageCourse
        },
        {
          path: '/classExam',          
          name: 'classExam',
          component: ClassExam
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
        {
          path: '/userManage',          
          name: 'userManage',
          component: UserManage
        },
        {
          path: '/educationWindow',          
          name: 'educationWindow',
          component: EducationWindow
        },
        {
          path: '/manageCourseWindow',          
          name: 'manageCourseWindow',
          component: ManageCourseWindow
        },
        {
          path: '/manageExperiment',          
          name: 'manageExperiment',
          component: ManageExperiment
        },
        {
          path: '/manageExam',          
          name: 'manageExam',
          component: ManageExam
        },
      ]
    }
  ]
})

export default router
