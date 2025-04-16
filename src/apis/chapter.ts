import { httpInstance } from '@/utils/http-util'

// 获取章节列表
export const getChapterList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/subcourse/',
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

// 创建新章节
export const createChapter = (form: object) => {
  return httpInstance({
    url:'/subcourse/',
    method: "POST",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取章节详情
export const getChapterDetail = (id: number) => {
  return httpInstance({
    url:'/subcourse/' + id + '/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 修改章节
export const modifyChapter = (id: number, form: object) => {
  return httpInstance({
    url:'/subcourse/' + id + '/',
    method: "PUT",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取章节选项
export const getChapterOption = () => {
  return httpInstance({
    url:'/subcourse/option/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 删除文件
export const deleteFile = (name: string) => {
  return httpInstance({
    url:'/file/',
    method: "DELETE",
    params: {
      name: name,
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}