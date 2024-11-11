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