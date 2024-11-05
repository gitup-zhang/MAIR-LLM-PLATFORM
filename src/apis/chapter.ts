import { httpInstance } from '@/utils/http-util'

// 获取章节列表
export const getChapterList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/subcourse/',
    method: "GET",
    params: {
      desc: searchText,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}