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