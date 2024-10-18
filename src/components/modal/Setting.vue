<script setup lang="ts">
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

</script>

<template>
  <div @click="systemStore.openSettingModal()" class="sider-nav-icon">
    <slot name="default"></slot>
  </div>

  <!-- 设置框 -->
  <el-dialog v-model="systemStore.settingModalVisible" title="设置" class="settingModal">
    <el-row>
      <el-col :span="8">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>应用</span>
            </template>
            <el-menu-item index="1-1">外观</el-menu-item>
        </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><location /></el-icon>
              <span>大模型</span>
            </template>
            <el-menu-item index="2-1">月之暗面</el-menu-item>
            <el-menu-item index="2-2">智谱清言</el-menu-item>
            <el-menu-item index="2-3">讯飞星火</el-menu-item>
            <el-menu-item index="2-4">阿里通义</el-menu-item>
            <el-menu-item index="2-5">百度文心</el-menu-item>
            <el-menu-item index="2-6">百川智能</el-menu-item>
            <el-menu-item index="2-7">天工开物</el-menu-item>
            <el-menu-item index="2-8">阶跃星辰</el-menu-item>
            <el-menu-item index="2-9">深度求索</el-menu-item>
            <el-menu-item index="2-10">OpenAI</el-menu-item>
            <el-menu-item index="2-11">Ollama</el-menu-item>
        </el-sub-menu>
    </el-menu>
      </el-col>
      <el-col :span="16">

      </el-col>
    </el-row>

    
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
.settingModal {
  /* height: 1000px; */
}
</style>
