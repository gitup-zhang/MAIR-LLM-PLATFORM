<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getClassList } from '@/apis/experiment'
import ExperimentDetail from '@/components/modal/ExperimentDetail.vue'
import { useSystemStore } from '@/stores/system'

import { useRouter, RouterView, RouterLink } from "vue-router"
const router = useRouter();

// 进入实验
const openExperiment = () => {
  router.push("/experimentConduct")
}
// 进入学生课程报告页面
const openStuReport = () => {
  router.push("/stuCourseReport")
}


const systemStore = useSystemStore()
const classList = ref([])
const page = 1;
const count = 6;

const testInput = ref('')
// 自定义课程列表
const courseList = ref([
  {
    id: 1,
    courseName: '计算机组成原理',
    courseTotalTime: 3
  },
  {
    id: 2,
    courseName: '深度学习',
    courseTotalTime: 4
  },
  {
    id: 3,
    courseName: '机器学习',
    courseTotalTime: 4
  },
  {
    id: 4,
    courseName: '大模型导论',
    courseTotalTime: 10
  },
])

const chapterData = [
  {
    id: '1',
    name: 'test1',
    description: '描述',
    progress: '0%',
    function: '操作',
  },
  {
    id: '2',
    name: 'test2',
    description: '描述',
    progress: '0%',
    function: '操作',
  },
  {
    id: '3',
    name: 'test3',
    description: '描述',
    progress: '0%',
    function: '操作',
  },
  {
    id: '4',
    name: 'test4',
    description: '描述',
    progress: '0%',
    function: '操作',
  },
]

// 自定义班级通知
const notificationData = [
  {
    id: '1',
    content: '测试',
    file: '无',
    time: '2024-09-20 10:19:54'
  }
]

// onMounted(async () => {
//   const data = await getClassList('study', 1, 6);
//   console.log('@@@', data)
// })
</script>

<template>
  <div class="course-page">
    <el-row>
      <el-col :span="8" v-for="course in courseList" :key="course.id">
        <!-- 课程卡片 -->
        <el-card body-style="padding:0px" class="course-card">
          <!-- 配图 -->
          <img src="@/assets/img/course.png" style="width: 100%"/>
          <div class="course-card-main">
            <span class="course-title">{{ course.courseName }}</span>
            <el-button type='primary' text>{{ course.courseTotalTime }}课时</el-button>
            <el-button type='primary' text @click="systemStore.openClassNotificationModal()">班级通知</el-button>
            <el-button type='primary' text @click="systemStore.openExperimentDetailModal()">进入课程</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <!-- 实验详情框 -->
  <el-dialog v-model="systemStore.experimentDetailVisible" title="实验详情" class="experimentDetailModal">
    <!-- 章节列表 -->
    <div class="chapter-list">
      <el-table :data="chapterData" border style="width: 100%">
        <el-table-column prop="id" label="章节" width="60" />
        <el-table-column prop="name" label="名称" width="80" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="progress" label="进度" />
        <!-- 右侧固定列 展示详情信息 -->
        <el-table-column fixed="right" label="操作" min-width="60">
          <template #default>
            <el-button link type="primary" size="small" @click="openExperiment()">进入实验</el-button>
            <el-button link type="primary" size="small">课堂交流</el-button>
            <el-button link type="primary" size="small" @click="openStuReport()">学习报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>

  <!-- 班级通知框 -->
  <el-dialog v-model="systemStore.classNotificationVisible" title="班级通知" class="experimentDetailModal">
    <!-- 搜索框 -->
    <div class="notification-header">
      <el-input v-model="testInput" style="width: 240px" class="mr-3" placeholder="请输入内容" />
      <el-button type="primary" class="mr-3">搜索</el-button>
    </div>
    <!-- 通知列表 -->
    <div class="notification-list">
      <el-table :data="notificationData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="content" label="通知内容"/>
        <el-table-column prop="file" label="文件"/>
        <el-table-column prop="time" label="发布时间" />
      </el-table>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 整体页面设置 */
.course-page {
  height: 100%;
  width: inherit;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-3 rounded-md;
}
.course-main {
  height: 100%;
  width: 100%;
}
.course-card {
  width: 300px;
  margin-top: 2rem;
}
.course-card-main {
  text-align: center;
  @apply pb-1;
}
.course-title {
  display: block;
}
.notification-header {
  @apply mb-2;
}
</style>
