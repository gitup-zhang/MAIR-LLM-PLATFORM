<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { useRouter } from 'vue-router'
import { getCourseList, getCourseApplyRecord, deleteCourseApply, getEnrolledClassList } from '@/apis/course'
import { useUserStore } from '@/stores/user'

const router = useRouter();
const userStore = useUserStore();

const data = reactive({
  activeName: 'first',
  searchText: '',
  // 全部班级信息
  courseList: [],
  enrolledClassList: [],
  // 当前选中的班级信息
  currentCourseDetail: [],
  // 班级申请记录
  courseApplyList: [],
  page: 1,
  count: 10,
  total: 0,
  courseDetailVisible: false,
  courseApplyDetailVisible: false
})

// 搜索课程
const searchCourse = async () => {
  const res = await getCourseList(data.searchText, data.page, data.count);
  data.courseList = res.data.list;
}

// 获取已经报名的课程列表
const getEnrolledClass = async () => {
  const res = await  getEnrolledClassList(data.page, data.count);
  data.enrolledClassList = res.data.list;
}

// 查看课程申请记录
const getCourseApplyDetail = async () => {
  data.courseApplyDetailVisible = true;
  const res = await getCourseApplyRecord(userStore.id, data.page, data.count);
  data.courseApplyList = res.data.list;
}
// 取消申请
const removeCourseApply = async (applyId:number) => {
  const res = deleteCourseApply(applyId);
  // 刷新
  getCourseApplyDetail()
}
// 查看课程详情
const getCourseDetail = (courseDetail: any) => {
  data.courseDetailVisible = true;
  data.currentCourseDetail = courseDetail;
}
// 获取考试详情
const getExamDetail = (courseDetail: any) => {
  router.push({
    path: "/classExam",
    query: {
      id: courseDetail.id
    }
  })
}

onMounted(() => {
  // 挂载课程信息
  searchCourse();
  // 挂载已经报名的课程信息
  getEnrolledClass();
})


// 测试数据
const course = ref('')
const apply = ref('')
const coursesType = [
  {
    value: '计算机科学',
    label: '计算机科学',
  },
  {
    value: '机器学习',
    label: '机器学习',
  },
  {
    value: '大语言模型',
    label: '大语言模型',
  },
  {
    value: '深度学习',
    label: '深度学习',
  },
]
const applyStatus = [
  {
    value: '申请成功',
    label: '申请成功',
  },
  {
    value: '申请失败',
    label: '申请失败',
  },
  {
    value: '审核中',
    label: '审核中',
  }
]
const courseListTest = reactive([
  {
    id: 1,
    name: '测试1',
    course_name: '人工智能1',
    teacher_name: '王小波',
    capacity: 14,
    end_time: '20240909',
    college_name: '北京邮电大学',
    not_apply_reason: '拒绝'
  }
])
const enrolledClassListTest = reactive([
  {
    id: 1,
    name: '测试1',
    course_name: '人工智能1',
    teacher_name: '王小波',
    capacity: 14,
    end_time: '20240909',
    college_name: '北京邮电大学',
    not_apply_reason: '拒绝'
  }
])
</script>

<template>
  <div class="course-page">
    <el-tabs v-model="data.activeName" type="border-card" class="class-tabs" @tab-click="handleClick">
      <el-tab-pane label="全部班级信息" name="first">
        <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
        <div class="course-main">
          <!-- 课程搜索框 -->
          <div class="select-course">
          <!-- 搜索 -->
            <el-input v-model="data.searchText" style="width: 240px" class="mr-3" placeholder="请输入课程名称" />
            <el-button type="primary" class="mr-3" @click="searchCourse()">搜索</el-button>
            <el-button type="primary" class="ml-3" @click="getCourseApplyDetail()">班级申请记录</el-button>
          </div>
          <!-- 所有班级列表展示 -->
          <div class="course-list">
            <el-table :data="data.courseList" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="50" />
              <el-table-column prop="name" label="班级名"/>
              <el-table-column prop="course_name" label="课程名"/>
              <el-table-column prop="teacher_name" label="教师名"/>
              <el-table-column prop="capacity" label="学生数量"/>
              <el-table-column prop="end_time" label="截止时间"/>
              <el-table-column prop="college_name" label="教学单位名"/>
              <el-table-column prop="not_apply_reason" label="申请状态"/>
              <!-- 右侧固定列 展示详情信息 -->
              <el-table-column fixed="right" label="操作" min-width="60">
                <template v-slot="scope">
                  <el-button link type="primary" size="small" @click="getCourseDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已报名班级信息" name="second">
        <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
        <div class="course-main">
          <!-- 班级列表 -->
          <div class="course-list">
            <el-table :data="enrolledClassListTest" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="50" />
              <el-table-column prop="name" label="班级名"/>
              <el-table-column prop="course_name" label="课程名"/>
              <el-table-column prop="teacher_name" label="教师名"/>
              <el-table-column prop="capacity" label="学生数量"/>
              <el-table-column prop="end_time" label="截止时间"/>
              <!-- 右侧固定列 展示详情信息 -->
              <el-table-column fixed="right" label="操作" min-width="60">
                <template v-slot="scope">
                  <el-button link type="primary" size="small" @click="getCourseDetail(scope.row)">详情</el-button>
                  <el-button link type="primary" size="small" @click="getExamDetail(scope.row)">考试安排</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- 班级详情模态框 -->
  <el-dialog v-model="data.courseDetailVisible" title="班级详细信息" width="600" center>
    <el-descriptions
    direction="vertical"
    :column="4"
    border
    class="des-form"
    >
      <el-descriptions-item label="班级名" :span="2">{{ data.currentCourseDetail.name }}</el-descriptions-item>
      <el-descriptions-item label="教师名" :span="2">{{ data.currentCourseDetail.teacher_name }}</el-descriptions-item>
      <el-descriptions-item label="课程名" :span="2">{{ data.currentCourseDetail.course_name }}</el-descriptions-item>
      <el-descriptions-item label="容量" :span="2">{{ data.currentCourseDetail.capacity }}</el-descriptions-item>
      <el-descriptions-item label="起止时间" :span="4">{{ data.currentCourseDetail.start_time + '--' + data.currentCourseDetail.end_time}}</el-descriptions-item>
      <el-descriptions-item label="描述" :span="2">{{ data.currentCourseDetail.desc }}</el-descriptions-item>
      <el-descriptions-item label="教学单位名" :span="2">{{ data.currentCourseDetail.college_name }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <!-- 班级申请记录模态框 -->
  <el-dialog v-model="data.courseApplyDetailVisible" title="课程申请记录" width="800" center>
    <el-table :data="data.courseApplyList" border style="width: 100%">
      <el-table-column prop="class_id" label="ID" width="50" />
      <el-table-column prop="class_name" label="班级名"/>
      <el-table-column prop="create_time" label="时间"/>
      <el-table-column prop="status_desc" label="审核状态"/>
      <!-- 右侧固定列 展示详情信息 -->
      <el-table-column fixed="right" label="操作" min-width="60">
        <template v-slot="scope">
          <el-button type="danger" size="small" :disabled="scope.row.status !== 1" @click="removeCourseApply(scope.row.id)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<style scoped>
/* 整体页面设置 */
.course-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
/* 主内容区样式 */
.course-main {
  @apply flex flex-col mt-3;
}
/* 顶部图设计 */
.banner {
  width: 100%;
  height: 20%;
  @apply rounded-md;
}
.course-list {
  @apply flex flex-col mt-4 mr-2;
}
.class-tabs {
  height: 100%;
  width: 100%;
}
/* 展示列表样式 */
.des-form {
  height: 100%;
  width: 100%;
}
</style>
