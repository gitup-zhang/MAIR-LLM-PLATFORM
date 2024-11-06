import { httpInstance } from '@/utils/http-util'

// 获取试题列表
export const getExamQuestionList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/question/',
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

// 获取试题详情
export const getExamQuestionDetail = (id: number) => {
  return httpInstance({
    url: '/question/' + id + '/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}