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

// 创建新试题
export const createQuestion = (status: number, form: object) => {
  return httpInstance({
    url: '/question/',
    method: "POST",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 搜索试题相关信息
export const getQuestionRelation = (id: number, searchText: string, page: number, count: number) => {
  return httpInstance({
    url: '/exam_question_relation/',
    method: "GET",
    params: {
      exam_paper_id: id,
      title: searchText,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 向试卷添加试题
export const createQuestionRelation = (examPaperId: number, questionId: number, score: number) => {
  return httpInstance({
    url: '/exam_question_relation/',
    method: "POST",
    data: {
      exam_paper_id: examPaperId,
      question_id: questionId,
      score: score
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 搜索所有试题选项
export const getQuestionOptions = () => {
  return httpInstance({
    url: '/question/option/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 向试卷移除试题
export const deleteQuestionRelation = (id: number) => {
  return httpInstance({
    url: '/exam_question_relation/' + id + '/',
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 提交试题修改
export const modifyQuestion = (id: number, form: object) => {
  return httpInstance({
    url: '/question/' + id + '/',
    method: "PUT",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}