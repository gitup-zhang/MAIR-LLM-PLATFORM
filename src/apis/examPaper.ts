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

// 创建新试卷
export const createExamPaper = (form: object) => {
  return httpInstance({
    url:'/exam_paper/',
    method: "POST",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取试卷详情
export const getExamPaperDetail = (id: number) => {
  return httpInstance({
    url:'/exam_paper/' + id + '/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 提交试卷修改
export const modifyExamPaper = (id: number, form: object) => {
  return httpInstance({
    url:'/exam_paper/' + id + '/',
    method: "PUT",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 删除试卷
export const deleteExamPaper = (id: number) => {
  return httpInstance({
    url:'/exam_paper/' + id + '/',
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}