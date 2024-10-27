<script setup lang="ts">

</script>

<template>
  <el-row class="experiment-page">
    <el-col :span="16" class="course-list">
    1
    </el-col>
    <el-col :span="8" class="discuss-platform">
    2
    </el-col>
  </el-row>
</template>

<style scoped>
/* 整体页面设置 */
.experiment-page {
  width: 100%;
  height: 100%;
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
