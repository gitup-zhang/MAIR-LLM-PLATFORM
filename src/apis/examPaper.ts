import { httpInstance } from '@/utils/http-util'

// 获取试卷列表
export const getExamPaperList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/exam_paper/',
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