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
      <div class="side-poster">
        <img src="../../assets/img/poster.png" class="banner" alt="大模型实训平台">
      </div>
      
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
  /* width: inherit;
  height: 100%; */
  @apply bg-light-500;
}
.side-poster {
  height: 100%;
  box-sizing: border-box;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-3 rounded-md;
}
.banner {
  width: 99%;
  height: 100%;
  @apply rounded-md;
}
</style>
