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

// 获取所有镜像
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