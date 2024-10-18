import { httpInstance } from '@/utils/http-util'
import { type registerForm } from '@/types'

// 接收后端传递的用户数据
export const getUserData = (phone: string, password: string) => {
  return httpInstance({
    url: "/identify/",
    method: "GET",
    params: {
      phone: phone,
      password: password,
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  })
}

// 注册
export const registerUserData = (registerForm: registerForm) => {
  return httpInstance({
    url: "/identify/",
    method: 'POST',
    params: {
      phone: registerForm.phone,
      verify_code: registerForm.verifyCode,
      password: registerForm.password,
      checkPass: registerForm.confirmPassword,
      name: registerForm.name
    },
    headers: {
      "content-type": "application/json",
    },
    withCredentials: true,
  })
}