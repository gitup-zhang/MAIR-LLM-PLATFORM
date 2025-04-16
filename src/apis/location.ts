import { httpInstance } from '@/utils/http-util'

// 获取地区列表
export const getLocationList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/area/',
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

// 删除地区
export const deleteLocation = (id: number) => {
    return httpInstance({
      url:'/area/' + id + '/',
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true
    })
}

// 获取地区详情
export const getLocationDetail = (id: number) => {
    return httpInstance({
      url:'/area/' + id + '/',
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true
    })
}

// 修改地区详情
export const modifyLocationDetail = (id: number, name: string, parentId: number) => {
    return httpInstance({
      url:'/area/' + id + '/',
      method: "PUT",
      params: {
        name: name,
        parent_id: parentId
      },
      headers: {
        "content-type": "application/json",
      },
      withCredentials: true
    })
}

//  创建地区
export const createLocation = (form: object) => {
    return httpInstance({
      url:'/area/',
      method: "POST",
      data: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
        "charset": "utf-8"
      },
      withCredentials: true
    })
}

//  获取地区选项
export const getLocationOption = () => {
  return httpInstance({
    url:'/area/option/',
    method: "GET",
    headers: {
      "content-type": "application/json",
      "charset": "utf-8"
    },
    withCredentials: true
  })
}