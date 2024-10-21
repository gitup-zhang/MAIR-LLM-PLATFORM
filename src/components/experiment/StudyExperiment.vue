<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getClassList } from '@/apis/experiment'

import CourseList from '@/components/experiment/CourseList.vue'

const classList = ref([])
const page = 1;
const count = 6;

onMounted(async () => {
  const data = await getClassList('study', 1, 6);
  console.log('@@@', data)
})
</script>

<template>
  <el-row class="experiment-page">
    <el-col :span="16" class="course-list">
      <CourseList />
    </el-col>
    <el-col :span="8" class="discuss-platform">
        问答论坛
    </el-col>
  </el-row>
</template>

<style scoped>
/* 整体页面设置 */
.experiment-page {
  width: 100vw;
  height: 100vh;
  @apply bg-light-50;
}
.course-list {
  width: 100%;
  height: 100%;
}
.discuss-platform {
  @apply bg-sky-100 p-2;
}
</style>
