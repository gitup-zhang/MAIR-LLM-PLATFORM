import { httpInstance } from '@/utils/http-util'

// 获取课程列表
export const getCourseList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/class/',
    method: "GET",
    params: {
      name: searchText,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取已报名的班级列表
export const getEnrolledClassList = (page: number, count: number) => {
  return httpInstance({
    url:'/class/',
    method: "GET",
    params: {
      type: 'study',
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 查看班级申请记录
  export const getCourseApplyRecord = (userId: number, page: number, count: number) => {
    return httpInstance({
      url:'/course_application/',
      method: "GET",
      params: {
        user_id: userId,
        page: page,
        count: count
      },
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true
    })
  }

  // 删除申请
  export const deleteCourseApply = (applyId: number) => {
    return httpInstance({
      url:'/course_application/' + `${applyId}`,
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true
    })
  }

// 查找教师管理的课程
export const getManageCourse = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/class/',
    method: "GET",
    params: {
      name: searchText,
      type: 'teach',
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}
