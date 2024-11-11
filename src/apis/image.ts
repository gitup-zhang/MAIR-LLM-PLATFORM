import { httpInstance } from '@/utils/http-util'

// 获取镜像列表
export const getImageList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/image/admin/',
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

// 获取镜像列表
export const getImageInfo = () => {
  return httpInstance({
    url:'/image/list/',
    method: "GET",
    params: {
      user_id: sessionStorage.userId,
      page: 1,
      count: 10
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取所有镜像选项
export const getImageOptions = () => {
  return httpInstance({
    url:'/image/all/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}