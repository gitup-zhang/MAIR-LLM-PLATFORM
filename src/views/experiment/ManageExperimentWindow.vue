<script setup lang="ts">
import { reactive } from 'vue';

const data = reactive({
  activeName: 'first',
  // 地区名输入框
  inputLocation: '',
  inputEducation: '',
  inputClss: ''

})
</script>

<template>
  <div class="education-page">
    <el-tabs v-model="data.activeName" class="education-tabs" @tab-click="handleClick">
      <el-tab-pane label="镜像管理" name="first" class="education-pane">
        <div class="search-box">
          <div class="search-title">镜像管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputLocation" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入镜像名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExam()">搜索</el-button>
          </div>
        </div>
      </el-tab-pane>

    <el-tab-pane label="容器管理" name="second">
      <div class="search-box">
          <div class="search-title">容器管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputEducation" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入容器名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExam()">搜索</el-button>
          </div>
        </div>
    </el-tab-pane>
  </el-tabs>

  </div>

</template>

<style scoped>
/* 整体页面设置 */
.education-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.education-tabs {
  height: 100%;
  width: 100%;
}
.education-pane {
  height: 100%;
  width: 100%;
}
.search-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md;
}
.search-title {
  position: absolute;
  left: 2rem;
  @apply text-2xl italic font-semibold text-light-50;
}
</style>
