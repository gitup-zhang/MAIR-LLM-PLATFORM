<script setup lang="ts">
// 引入 System 状态
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

</script>

<template>
  <div @click="systemStore.openChatWindowModal()" class="sider-nav-icon">
    <slot name="default"></slot>
  </div>

  <!-- 聊天框 -->
  <el-dialog v-model="systemStore.chatWindowVisible" title="与大模型对话" class="chatModal">
   
  </el-dialog>
</template>

<style scoped>
.chatModal {

}
.sider-nav-icon {
  width: 100%;
  @apply mb-3 flex flex-col items-center text-gray-500 rounded-md;
}
.sider-nav-icon:hover{
  @apply text-blue-500 bg-sky-50;
}
</style>
