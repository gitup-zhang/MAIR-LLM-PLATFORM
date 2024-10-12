<script setup lang="ts">
import { DataAnalysis, User } from '@element-plus/icons-vue'
</script>

<template>
  <el-row>
    <!-- 侧边栏 -->
    <el-col :xs="0" :sm="2" :md="2" :lg="1" :xl="1" class="sider-nav">
      <div class="sider-nav-main">
        <!-- Logo -->
        <img src="../../assets/img/logo.png" alt="大模型实训平台" class="h-10 w-10 mt-2 mb-2">
        <span class="h-[0.15rem] w-14 bg-gray-200 mb-2 mt-2"></span>

        <!-- 个人信息 -->
        <div class="sider-nav-icon">
            <icon-user  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">我的</div>
        </div>
        <!-- 课程信息 -->
        <div class="sider-nav-icon">
          <icon-book  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">课程</div>
        </div>
        <!-- 实验平台 -->
        <div class="sider-nav-icon">
          <icon-experiment  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">实验</div>
        </div>
        <!-- 设置 -->
        <div class="sider-nav-icon">
          <icon-settings  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">设置</div>
        </div>
      </div>
      <div class="sider-nav-bottom">

      </div>

    </el-col>



    <el-col :xs="24" :sm="22" :md="22" :lg="23" :xl="23" class="login-left">
            <!-- 头部栏 -->
            <el-row class="header-nav">
                <!-- 头部栏内容区 -->
                <div class="header-nav-main">
                    大模型实训平台
                </div>
            </el-row>
            <el-row class="content">
                <div class="content-main">
                    <!-- 主界面区 -->

                </div>
            </el-row>
        </el-col>
    </el-row>
</template>

<style scoped>
.sider-nav {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    @apply bg-light-500 flex-col pt-1 pl-1 pb-1;
}
.sider-nav-main {
    width: 100%;
    height: 100%;
    @apply bg-light-50 flex flex-col items-center rounded-md p-1;
}
.sider-nav-icon {
    width: 100%;
    @apply mb-3 flex flex-col items-center text-gray-500 rounded-md;
}
.sider-nav-icon:hover{
    @apply text-blue-500 bg-sky-50;
}
.icon-text {
    @apply mt-1 text-xs font-medium ;
}
.sider-nav-bottom {

}
.header-nav {
    width: 100%;
    height: 8vh;
    background-color: aquamarine;
    box-sizing: border-box;
    @apply bg-light-500 p-2;
}
.header-nav-main {
    width: 100%;
    height: 100%;
    @apply bg-light-50;
}
.content {
    width: 100%;
    height: 92vh;
    box-sizing: border-box;
    @apply bg-light-500 pb-2 pl-2 pr-2;
}
.content-main {
    width: 100%;
    height: 100%;
    @apply bg-light-50;
}
</style>
