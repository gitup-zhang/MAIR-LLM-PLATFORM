<script setup lang="ts">
import CourseList from '@/components/experiment/CourseList.vue'
import DiscussPlatform from '@/components/experiment/DiscussPlatform.vue';
</script>

<template>
  <el-row class="experiment-page">
    <el-col :span="16" class="course-list">
      <CourseList />
    </el-col>
    <el-col :span="8" class="discuss-platform">
      <DiscussPlatform />
    </el-col>
  </el-row>
</template>

<style scoped>
/* 整体页面设置 */
.experiment-page {
  width: 100vw;
  height: 100vh;
}
.course-list {
  width: 100%;
  height: 100%;
  @apply bg-light-500 pr-1;
}
.discuss-platform {
  @apply bg-light-500;
}
</style>
