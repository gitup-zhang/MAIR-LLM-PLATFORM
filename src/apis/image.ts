import { httpInstance } from '@/utils/http-util'

// 获取课程列表
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