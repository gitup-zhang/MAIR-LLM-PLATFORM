import { defineStore } from 'pinia'

// 定义 User 状态
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    // 用户信息
    id: '',
    avatar: '',
    name: '',
    email: '',
    phone: '',
    userType: '',
    userName: '',
    idCard: ''
  }),
})