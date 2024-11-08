import { httpInstance } from '@/utils/http-util'

// 获取考试信息列表
export const getExamList = (searchText: string, classId: number, page: number, count: number) => {
  return httpInstance({
    url:'/exam/',
    method: "GET",
    params: {
      desc: searchText,
      class_id: classId,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取学生考试结果列表
export const getStuExamPaperList = (examId: number, stuId: string, page: number, count: number) => {
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

// 获取试卷详情
export const getExamPaperInfo = (examPaperId: number) => {
  return httpInstance({
    url:'/user_exam/' + examPaperId + '/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取考试信息列表
export const getExamInfoList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/exam/',
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

// 创建考试
export const createExam = (form: object) => {
  return httpInstance({
    url:'/exam/',
    method: "POST",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 取消考试
export const deleteExam = (id: number) => {
  return httpInstance({
    url:'/exam/' + id + '/',
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取考试详情
export const getExamDetail = (id: number) => {
  return httpInstance({
    url:'/exam/' + id + '/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}