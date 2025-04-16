import { httpInstance } from '@/utils/http-util'

// 获取实验列表
export const getClassList = (type: string, page: number, count: number) => {
  return httpInstance({
    url:'/class/',
    method: "GET",
    params: {
      type: type,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取课程详细信息
export const getCourseDetailInfo = (courseId:number, page:number, count:number) => {
  return httpInstance({
    url:'/course_relation/',
    method: "GET",
    params: {
      class_id: courseId,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}