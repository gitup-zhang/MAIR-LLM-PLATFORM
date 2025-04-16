import { httpInstance } from '@/utils/http-util'

// 获取镜像列表
export const getImageList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url:'/image/admin/',
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

// 获取镜像列表
export const getImageInfo = (page: number, count: number) => {
  return httpInstance({
    url:'/image/list/',
    method: "GET",
    params: {
      user_id: sessionStorage.userId,
      page: 1,
      count: 10
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取所有镜像选项
export const getImageOptions = () => {
  return httpInstance({
    url:'/image/all/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 删除镜像
export const deleteImage = (imageId: number, imageTag: string) => {
  return httpInstance({
    url:'/image/delete/',
    method: "POST",
    data: {
      image_id: imageId,
      image_tag: imageTag
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 创建镜像
export const createImage = (imageId: any) => {
  return httpInstance({
    url:'/image/create/',
    method: "GET",
    params: {
      image_id: imageId
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 创建镜像
export const buildImage = (containerId: string, desc: string, name: string, imageId: any) => {
  return httpInstance({
    url:'/image/build/',
    method: "POST",
    data: {
      container_id: containerId,
      desc: desc,
      name: name,
      image_id: imageId
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 查看镜像详情
export const getImageDetail = (imageId: number) => {
  return httpInstance({
    url:'/container/watch/',
    method: "GET",
    params: {
      image_id: imageId
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}