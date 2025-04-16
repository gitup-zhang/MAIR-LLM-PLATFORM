import { httpInstance } from '@/utils/http-util'

// 获取考试结果信息列表
export const getExamResultList = (examId: string, stuId: string, page: number, count: number) => {
  return httpInstance({
    url:'/user_exam/',
    method: "GET",
    params: {
      exam_id: examId,
      id_number: stuId,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}