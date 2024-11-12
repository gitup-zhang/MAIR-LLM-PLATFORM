<script setup lang="ts">
import { useRouter, RouterView, RouterLink } from "vue-router"
import { reactive, toRefs } from "vue";

// 引入模态框组件
import Setting from '@/components/modal/Setting.vue'
import About from '@/components/modal/About.vue'
import ChatMain from "@/components/chat/ChatMain.vue";

const router = useRouter();

const data = reactive({
  aboutUsVisible : false,
  settingVisible : false,
  userType: sessionStorage.userType
  // userType: '1'
})
const { aboutUsVisible, settingVisible } = toRefs(data)

// 退出系统
const quit = () => {
  router.push("/")
  console.log('data:', typeof(data.userType))
}
</script>

<template>
  <el-row class="experiment-page">
    <!-- 侧边栏 -->
    <el-col :xs="0" :sm="2" :md="2" :lg="1" :xl="1" class="sider-nav">
      <div class="sider-nav-main">
        <!-- Logo -->
        <img src="../assets/img/logo.png" alt="大模型实训平台" class="h-10 w-10 mt-2 mb-2">
        <span class="h-[0.15rem] w-14 bg-gray-200 mb-2 mt-2"></span>

        <!-- 个人信息 学生 -->
        <RouterLink v-if="data.userType === '1'" class="sider-nav-icon" to="/me">
          <icon-user  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">我的</div>
        </RouterLink>

        <!-- 课程信息 学生 -->
        <RouterLink v-if="data.userType === '1'" class="sider-nav-icon" to="/course">
          <icon-book  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">课程</div>
        </RouterLink>

        <!-- 实验平台 学生 -->
        <RouterLink v-if="data.userType === '1'" class="sider-nav-icon" to="/experiment">
          <icon-experiment  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">实验</div>
        </RouterLink>

        <!-- 个人信息 教师 -->
        <RouterLink v-if="data.userType === '2'" class="sider-nav-icon" to="/teacherMe">
          <icon-user  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">我的</div>
        </RouterLink>

        <!-- 课程信息 教师 -->
        <RouterLink v-if="data.userType === '2'" class="sider-nav-icon" to="/adminClass">
          <icon-book  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">课程</div>
        </RouterLink>



        <!-- 个人信息 教务 -->
        <RouterLink v-if="data.userType === '3'" class="sider-nav-icon" to="/adminMe">
          <icon-user  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">我的</div>
        </RouterLink>

        <!-- 个人信息 教务 -->
        <RouterLink v-if="data.userType === '3'" class="sider-nav-icon" to="/adminClass">
          <icon-home  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">班级</div>
        </RouterLink>

        <!-- 用户管理 教务 -->
        <RouterLink v-if="data.userType === '3'" class="sider-nav-icon" to="/userManageWindow">
          <icon-user-group  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">用户</div>
        </RouterLink>

        <!-- 教务管理 教务 -->
        <RouterLink v-if="data.userType === '3'" class="sider-nav-icon" to="/educationWindow">
          <icon-interaction size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">教务</div>
        </RouterLink>

        <!-- 课程管理 教务 -->
        <RouterLink v-if="data.userType === '3'" class="sider-nav-icon" to="/manageCourseWindow">
          <icon-book size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">课程</div>
        </RouterLink>

        <!-- 课程管理 教务 -->
        <RouterLink v-if="data.userType === '3'" class="sider-nav-icon" to="/manageExamWindow">
          <icon-bar-chart size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">考试</div>
        </RouterLink>

        <!-- 实验管理 教务 -->
        <RouterLink v-if="data.userType === '3'" class="sider-nav-icon" to="/manageExperimentWindow">
          <icon-experiment size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">实验</div>
        </RouterLink>

        <!-- 与大模型对话 -->
        <ChatMain v-if="data.userType === '1'">
          <template #default>
            <icon-robot size="33" strokeWidth="3" class="mt-2"/>
            <div class="icon-text">对话</div>
          </template>
        </ChatMain>

        <About>
          <template #default>
            <icon-question-circle  size="33" strokeWidth="3" class="mt-2"/>
            <div class="mt-1 text-xs font-medium">关于</div>
          </template>
        </About>

        <!-- 退出 -->
        <div class="sider-nav-icon-bottom" @click="quit">
          <icon-export  size="33" strokeWidth="3" class="mt-2"/>
          <div class="icon-text">退出</div>
        </div>
      </div>

    </el-col>

    <el-col :xs="24" :sm="22" :md="22" :lg="23" :xl="23" class="window-main">
      <!-- 主内容区 -->
      <div class="experiment-left-main">
        <RouterView></RouterView>
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
/* 右侧侧边栏区 */
.sider-nav {
  box-sizing: border-box;
  @apply bg-light-500 flex-col pt-1 pl-2 pr-1 pb-2;
}
.sider-nav-main {
    width: 100%;
    height: 100%;
    position: relative;
    box-shadow: 1px 1px 2px #d1d5db;
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
.sider-nav-icon-bottom {
  position: absolute;
  bottom: 10px;
  width: 100%;
  @apply mb-3 flex flex-col items-center text-gray-500 rounded-md;
}
.sider-nav-icon-bottom:hover{
  @apply text-blue-500;
}

/* 左侧主页面区 */
.window-main {
  box-sizing: border-box;
  @apply bg-light-500 flex-col pt-1 pl-1 pr-2 pb-2;
}
.experiment-left-main {
  width: 100%;
  height: 100%;
  /* box-shadow: 1px 1px 2px #d1d5db; */
  /* @apply bg-light-50 flex flex-col items-center rounded-md p-1; */
  @apply flex flex-col items-center;
}
</style>
