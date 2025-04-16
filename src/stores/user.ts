<<<<<<< HEAD
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
    roleId: 2,
    role: '',
    personId: '',
    areaId: 1,
    createTime: 1,
    modifyTime: 1,
  }),
=======
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
    roleId: 2,
    role: '',
    personId: '',
    areaId: 1,
    createTime: 1,
    modifyTime: 1,
  }),
>>>>>>> c0bb64e9aff82d110ad8814df620b5d8587b89cd
})