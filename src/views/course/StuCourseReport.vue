<script setup lang="ts">
import { ref } from 'vue';

const testInput = ref('')
</script>

<template>
  <div class="course-report-page">
    <el-row>
      <el-col :span="12">
        <!-- 搜索框 -->
        <el-input v-model="testInput" style="width: 240px" class="mr-3" placeholder="请输入标题" />
        <el-button type="primary" class="mr-3">搜索</el-button>
        <el-button type="primary" class="mr-3">创建报告</el-button>

        <!-- 报告展示 -->
        <el-table :data="notificationData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="content" label="通知内容"/>
            <el-table-column prop="file" label="文件"/>
            <el-table-column prop="time" label="发布时间" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <!-- 搜索框 -->
        <el-input v-model="testInput" style="width: 240px" class="mr-3" placeholder="请输入标题" />
        <el-button type="primary" class="mr-3">搜索</el-button>
        <el-button type="primary" class="mr-3">创建报告</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<style scoped>
/* 页面整体设置 */
.course-report-page {
  height: 100%;
  width: inherit;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-3 rounded-md;
}
</style>
