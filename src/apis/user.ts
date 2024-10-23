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
