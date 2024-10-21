import { defineStore } from 'pinia'

export const useSystemStore = defineStore({
  id: 'system',
  state: () => ({
    // 设置模态框是否可见
    settingModalVisible: false,
    // 关于我们模态框是否可见
    aboutModalVisible: false,
    // 实验详情模态框是否可见
    experimentDetailVisible: false
  }),
  actions: {
    // 打开设置模态框
    openSettingModal() {
      this.settingModalVisible = true
    },
    // 打开关于模态框
    openAboutModal() {
      this.aboutModalVisible = true
    },
    // 打开实验详情模态框
    openExperimentDetailModal() {
      this.experimentDetailVisible = true
    }
  }
})