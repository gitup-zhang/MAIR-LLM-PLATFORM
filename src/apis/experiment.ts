import { httpInstance } from '@/utils/http-util'

// 获取课程列表
export const getClassList = (type: string, page: number, count: number) => {
  return httpInstance({
    url:'/class/',
    method: "Get",
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