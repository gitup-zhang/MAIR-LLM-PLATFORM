<script setup lang="ts">
// 引入 System 状态
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

</script>

<template>
  <div @click="systemStore.openAboutModal()" class="sider-nav-icon">
    <slot name="default"></slot>
  </div>

  <!-- 关于我们模态框 -->
  <el-dialog v-model="systemStore.aboutModalVisible" title="关于我们" width="700">
    <div class="about-page">
      <div class="about-item">
        <div class="about-text">应用版本</div>
        <el-badge class="item">
          <el-button>1.0</el-button>
        </el-badge>
      </div>
      <div class="about-item">
        <div class="about-text">开发者</div>
        <el-badge class="item">
          <el-button>北京邮电大学MAIR团队</el-button>
        </el-badge>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.sider-nav-icon {
  width: 100%;
  @apply mb-3 flex flex-col items-center text-gray-500 rounded-md;
}
.sider-nav-icon:hover{
  @apply text-blue-500 bg-sky-50;
}
.about-page {
  @apply flex flex-col;
}
.about-item {
  @apply m-2;
}
.about-text {
  @apply text-gray-500 text-base mb-1;
}
</style>
