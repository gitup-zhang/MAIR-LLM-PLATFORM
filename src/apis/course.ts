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
      url:'/course_application/' + applyId + '/',
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

// 获取课程列表
export const getCourseInfoList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/course/',
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

// 获取课程选项
export const getCourseOptions = () => {
  return httpInstance({
    url:'/course/option/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 创建新课程
export const createCourse = (form: object) => {
  return httpInstance({
    url:'/course/',
    method: "POST",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取课程详情
export const getCourseDetail = (id: number) => {
  return httpInstance({
    url:'/course/' + id + '/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 提交课程修改
export const modifyCourse = (id: number, form: object) => {
  return httpInstance({
    url:'/course/' + id + '/',
    method: "PUT",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}