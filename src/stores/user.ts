import { defineStore } from 'pinia'

// 定义 User 状态
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    // 用户信息
    id: 0,
    nickname: '',
    avatar: '',
    stuId: '',
    name: '',
    email: '',
    phone: '',
    roleId: 1,
    role: '',
    personId: '',
    areaId: 1,
    createTime: 1,
    modifyTime: 1,
  }),
})