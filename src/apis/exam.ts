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

// 获取ID值
export const getUserExamId = (id: number) => {
  return httpInstance({
    url:'/user_exam/to/',
    method: "GET",
    params: {
      exam_id: id
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 自动获取试卷评分
export const getExamComment = (id: number) => {
  return httpInstance({
    url:'/exammarkapi/',
    method: "POST",
    data: {
      user_exam_id: id
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 保存评分
export const saveExamScore = (id: number, questionList: any, operation: string) => {
  return httpInstance({
    url:'/user_exam/score/' + id + '/',
    method: "PUT",
    data: JSON.stringify({
      new_answer_info: questionList,
      operation: operation
    }),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}


// 保存作答结果
export const saveExamAnswer = (id: number, questionList: any, operation: string) => {
  return httpInstance({
    url:'/user_exam/save/' + id + '/',
    method: "PUT",
    data: JSON.stringify({
      new_answer_info: questionList,
      operation: operation
    }),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}