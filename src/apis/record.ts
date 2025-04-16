import { httpInstance } from '@/utils/http-util'

// 获取学生学习进度列表
export const getStuStudyProgessDetail = (subcourseId: number, classId: number, page: number, count: number) => {
  return httpInstance({
    url:'/learn_record/student_list/',
    method: "GET",
    params: {
      subcourse_id: subcourseId,
      class_id: classId,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取教师管理视角下的学习进度列表
export const getTeacherStudyProgessDetail = (subcourseId: number, classId: number, page: number, count: number) => {
  return httpInstance({
    url:'/learn_record/list/',
    method: "GET",
    params: {
      subcourse_id: subcourseId,
      class_id: classId,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}