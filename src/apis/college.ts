import { httpInstance } from '@/utils/http-util'

// 获取教学单位列表
export const getCollegeList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/college/',
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

// 获取教学单位详情
export const getCollegeDetail = (id: number) => {
    return httpInstance({
      url:'/college/' + id + '/',
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true
    })
}

// 提交教学单位修改
export const submitCollegeModifyInfo = (id: number, form: object) => {
    return httpInstance({
      url:'/college/' + id + '/',
      method: "PUT",
      data: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true
    })
}

// 创建教学单位
export const createCollege = (form: object) => {
    return httpInstance({
      url:'/college/',
      method: "POST",
      data: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true
    })
}

// 删除教学单位
export const deleteCollege = (id: number) => {
    return httpInstance({
      url:'/college/' + id + '/',
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true
    })
}

// 获取教学单位选项
export const getCollegeOptions = () => {
  return httpInstance({
    url:'/college/option/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}