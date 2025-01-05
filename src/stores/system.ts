import { defineStore } from 'pinia'

export const useSystemStore = defineStore({
  id: 'system',
  state: () => ({
    // 设置模态框是否可见
    settingModalVisible: false,
    // 关于我们模态框是否可见
    aboutModalVisible: false,
    // 实验详情模态框是否可见
    experimentDetailVisible: false,
    // 班级通知模态框是否可见
    classNotificationVisible: false,
    // 个人信息修改模态框是否可见
    userInfoEditVisible: false,
    // 个人头像修改模态框是否可见
    userAvatarEditVisible: false,
    // 聊天模态框是否可见
    chatWindowVisible: false,
    currentPage: 'Me'
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
    },
    // 打开班级通知模态框
    openClassNotificationModal() {
      this.classNotificationVisible = true
    },
    // 打开个人信息修改模态框
    openUserInfoEditModal() {
      this.userInfoEditVisible = true
    },
    // 打开用户头像修改模态框
    openUserAvatarEditModal() {
      this.userAvatarEditVisible = true
    },
    // 打开聊天模态框
    openChatWindowModal() {
      this.chatWindowVisible = true
    }
  },
  persist: true
})