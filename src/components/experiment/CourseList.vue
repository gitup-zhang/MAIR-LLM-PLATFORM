<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import { getClassList, getCourseDetailInfo } from '@/apis/experiment';
import { getNotificationList } from '@/apis/notification';


const router = useRouter();
const data = reactive({
  // 当前实验 ID
  currentExperimentId: -1,
  // 输入
  inputNotification: '',
  // 列表
  notificationList: [],
  courseList: [],
  // 课程内部的详细列表
  subcourseList: [],
  // 模态框
  experimentDetailModalVisible: false,
  classNotificationModalVisible: false,
  page: 1,
  count: 6,
  total: 0
})

// 获取课程列表
const getCourseList = async () => {
  const res = await getClassList('study', data.page, data.count);
  data.courseList = res.data.list;
}
// 获取课程详情
const getCourseDetail = async (courseId:number, page:number, count:number) => {
  const res = await getCourseDetailInfo(courseId, page, count);
  data.subcourseList = res.data.list;
}
// 进入课程
const openExperimentDetailModal = (courseId: number) => {
  data.currentExperimentId = courseId;
  data.experimentDetailModalVisible = true;
  getCourseDetail(courseId, 1, 10);
}
// 进入学生课程报告页面
const openStuReport = (courseId: number, subcourseId: number) => {
  data.experimentDetailVisible = false
  router.push({
    path: "/stuCourseReport",
    query: {
      courseId: courseId, 
      subcourseId: subcourseId
    }
  })
}

// 搜索班级通知
const searchNotification = async (classId: number) => {
  const res = await getNotificationList(classId, data.inputNotification, data.page, data.count);
  data.notificationList = res.data.list;
  data.total = res.data.total;
}
// 打开班级通知列表
const openClassNotificationModal = (id: number) => {
  data.classNotificationModalVisible = true;
  data.currentExperimentId = id;
  searchNotification(id);
}
// 进入实验
const openExperiment = () => {
  data.experimentDetailModalVisible = false
  router.push("/experimentConduct")
}

const classList = ref(
  [
    {
      id: 1,
      name: '测试1',
      student_num: 10,
      files_info: [
        {
          name: '文件1',
        },
        {
          name: '文件2'
        }
      ]
    },
    {
      id: 2,
      name: '测试2',
      student_num: 20,
    },
  ]
)


const testInput = ref('')


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
    files_info: [
        {
          name: '文件1',
        },
        {
          name: '文件2'
        }
    ],
    time: '2024-09-20 10:19:54'
  }
]

onMounted(() => {
  getCourseList()
})
</script>

<template>
  <div class="course-page">
    <el-row>
      <el-col :span="8" v-for="course in classList" :key="course.id">
        <!-- 课程卡片 -->
        <el-card body-style="padding:0px" class="course-card">
          <!-- 配图 -->
          <img src="@/assets/img/course.png" style="width: 100%"/>
          <div class="course-card-main">
            <span class="course-title">{{ course.name }}</span>
            <el-button type='primary' text>{{ course.student_num }}课时</el-button>
            <el-button type='primary' text @click="openClassNotificationModal(course.id)">班级通知</el-button>
            <el-button type='primary' text @click="openExperimentDetailModal(course.id)">进入课程</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <!-- 实验详情框 -->
  <el-dialog v-model="data.experimentDetailModalVisible" title="实验详情" class="experimentDetailModal">
    <!-- 章节列表 -->
    <div class="chapter-list">
      <el-table :data="data.subcourseList" stripe border style="width: 100%">
        <el-table-column prop="id" label="章节" width="60" />
        <el-table-column prop="name" label="名称" width="80" />
        <el-table-column prop="desc" label="描述" />
        <el-table-column prop="rate" label="进度" />
        <!-- 右侧固定列 展示详情信息 -->
        <el-table-column fixed="right" label="操作" min-width="60">
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="openExperiment()">进入实验</el-button>
            <el-button link type="primary" size="small">课堂交流</el-button>
            <el-button link type="primary" size="small" @click="openStuReport(data.currentExperimentId, scope.row.id)">学习报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>

  <!-- 班级通知框 -->
  <el-dialog v-model="data.classNotificationModalVisible" title="班级通知" class="experimentDetailModal">
    <!-- 搜索框 -->
    <div class="notification-header">
      <el-input v-model="data.inputNotification" style="width: 240px" class="mr-3" placeholder="请输入通知标题" />
      <el-button type="primary" class="mr-3" @click="searchNotification(data.currentExperimentId)">搜索</el-button>
    </div>
    <!-- 通知列表 -->
    <div class="notification-list">
      <el-table :data="notificationData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="content" label="通知内容"/>
        <el-table-column prop="file" label="文件">
          <template v-slot="scope">
            <template v-for="(file, index) in scope.row.files_info">
              {{ file.name }} <br>
            </template>
          </template>
        </el-table-column>
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
  transition: all .2s;
}
.course-card:hover {
  transform: scale(1.05);
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
