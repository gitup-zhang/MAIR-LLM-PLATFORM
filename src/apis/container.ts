import { httpInstance } from '@/utils/http-util'

// 获取容器列表
export const getContainerList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/container/admin/',
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

// 获取容器列表
export const getAllContainerList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/container/list/',
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

// 获取子课程相关容器列表
export const getSubcourseContainerList = (subcourseId: number, classId: number, page: number, count: number) => {
  return httpInstance({
    url:'/container/list/',
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

// 关闭容器
export const stopContainer = (id: number) => {
  return httpInstance({
    url:'/container/stop/',
    method: "GET",
    params: {
      container_id: id
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 启动容器
export const startContainer = (id: number) => {
  return httpInstance({
    url:'/container/start/',
    method: "GET",
    params: {
      container_id: id
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 删除容器
export const deleteContainer = (id: number) => {
  return httpInstance({
    url:'/container/delete/',
    method: "GET",
    params: {
      container_id: id
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}
export const createContainer = (
  userId: number,
  subcourseId: number,
  classId: number
) => {
  return httpInstance({
    url:'/image/create/',
    method: "GET",
    params: {
      user_id: userId,
      subcourse_id: subcourseId,
      class_id: classId
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}