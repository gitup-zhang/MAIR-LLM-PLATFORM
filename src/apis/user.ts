import { httpInstance } from '@/utils/http-util'

// 获取用户信息
export const getUserInfo = () => {
  return httpInstance({
    url:'/self/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 修改用户信息
export const editUserInfo = (userForm:any, id:number) => {
  return httpInstance({
    url:'/user/' + id + '/',
    method: "PUT",
    data: userForm,
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 角色申请
export const applyRole = (role: number) => {
  return httpInstance({
    url:'/user_application/',
    method: "POST",
    data: {
      new_type: role
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 角色申请记录
export const getApplyRoleList = () => {
  return httpInstance({
    url:'/user_application/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 密码修改
export const submitModifyPassword = (modifyPassword: any) => {
  return httpInstance({
    url:'/user/modify_password/',
    method: "PUT",
    data: modifyPassword,
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 搜索用户列表
export const getUserList = (searchUserName: string, searchUserId: string, page: number, count: number) => {
  return httpInstance({
    url:'/user/',
    method: "GET",
    params: {
      type: 0,
      name: searchUserName,
      id_number: searchUserId,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 搜索教师列表
export const getTeacherList = (searchUserName: string, searchUserId: string, page: number, count: number) => {
  return httpInstance({
    url:'/user/',
    method: "GET",
    params: {
      type: 2,
      name: searchUserName,
      id_number: searchUserId,
      page: page,
      count: count
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 创建用户
export const createUser = (form: object) => {
  return httpInstance({
    url:'/user/',
    method: "POST",
    data: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}

// 获取用户详细信息
export const getUserDetail = (id: number) => {
  return httpInstance({
    url:'/user/' + id + '/',
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true
  })
}