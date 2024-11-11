import { httpInstance } from '@/utils/http-util'

// 获取班级申请列表
export const getClassApplyList = (
  userId: string,
  page: number,
  count: number
) => {
  return httpInstance({
    url: "/course_application/",
    method: "GET",
    params: {
      id_number: userId,
      page: page,
      count: count,
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 同意或拒绝班级申请
export const evaluateClassApply = (
  userId: number,
  status: number
) => {
  return httpInstance({
    url: "/course_application/" + userId + '/',
    method: "PUT",
    data: JSON.stringify({
      status: status
    }),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 创建班级
export const createClass = (form: object) => {
  return httpInstance({
    url: "/class/",
    method: "POST",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 获取班级详情
export const getClassDetail = (id: number) => {
  return httpInstance({
    url: "/class/" + id + "/",
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 班级信息修改
export const modifyClass = (id: number, form: object) => {
  return httpInstance({
    url: "/class/" + id + "/",
    method: "PUT",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 获取所有班级选项
export const getClassOptions = () => {
  return httpInstance({
    url: "/class/option/",
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 获取报名的班级列表
export const getClassList = (page: number, count: number) => {
  return httpInstance({
    url: "/class/",
    method: "GET",
    params: {
      type: 'study',
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 获取报名的班级列表
export const getManagedClassList = (searchText: string, page: number, count: number) => {
  return httpInstance({
    url: "/class/",
    method: "GET",
    params: {
      name: searchText,
      type: 'teach',
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};

// 获取授课的班级列表
export const getTeachedClassList = (page: number, count: number) => {
  return httpInstance({
    url: "/class/",
    method: "GET",
    params: {
      type: 'teach',
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  });
};