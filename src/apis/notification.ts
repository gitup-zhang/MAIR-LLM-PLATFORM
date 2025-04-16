<<<<<<< HEAD
import { httpInstance } from '@/utils/http-util'

// 获取课程通知列表
export const getNotificationList = (
  classId: number,
  searchText: string,
  page: number,
  count: number
) => {
  return httpInstance({
    url: "/announce/",
    method: "GET",
    params: {
      class_id: classId,
      content: searchText,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 删除课程通知列表
export const deleteNotification = (id: number) => {
  return httpInstance({
    url: "/announce/" + id + '/',
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 创建课程通知
export const createNotification = (form: object) => {
  return httpInstance({
    url: "/announce/",
    method: "POST",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
=======
import { httpInstance } from '@/utils/http-util'

// 获取课程通知列表
export const getNotificationList = (
  classId: number,
  searchText: string,
  page: number,
  count: number
) => {
  return httpInstance({
    url: "/announce/",
    method: "GET",
    params: {
      class_id: classId,
      content: searchText,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 删除课程通知列表
export const deleteNotification = (id: number) => {
  return httpInstance({
    url: "/announce/" + id + '/',
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 创建课程通知
export const createNotification = (form: object) => {
  return httpInstance({
    url: "/announce/",
    method: "POST",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
>>>>>>> c0bb64e9aff82d110ad8814df620b5d8587b89cd
};