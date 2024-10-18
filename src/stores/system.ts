import { defineStore } from 'pinia'

export const useSystemStore = defineStore({
  id: 'system',
  state: () => ({
    // 设置模态框是否可见
    settingModalVisible: false,
    aboutModalVisible: false
  }),
  actions: {
    // 打开设置模态框
    openSettingModal() {
      this.settingModalVisible = true
    },
    // 打开关于模态框
    openAboutModal() {
      this.aboutModalVisible = true
    }
  }
})