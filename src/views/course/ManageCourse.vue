<script setup lang="ts">
import { onMounted, reactive } from 'vue';

const data = reactive({
  searchText: ''
})

// 搜索用户管理的课程
const searchCourse = () => {

}

onMounted(() => {
    
})
</script>

<template>
  <div class="course-page">
    <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
    <div class="course-main">
      <!-- 课程搜索框 -->
      <div class="select-course">
        <!-- 搜索 -->
        <el-input v-model="data.searchText" style="width: 240px" class="mr-3" placeholder="请输入课程名称" />
        <el-button type="primary" class="mr-3" @click="searchCourse()">搜索</el-button>
      </div>


    </div>

  </div>
</template>

<style scoped>
/* 整体页面设置 */
.course-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
/* 图片样式 */
.banner {
  width: 100%;
  height: 20%;
  @apply rounded-md;
}
/* 主内容区 */
.course-main {
  @apply flex flex-col mt-3;
}
</style>
