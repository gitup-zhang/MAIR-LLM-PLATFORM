<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { getManageCourse } from '@/apis/course'
const data = reactive({
  searchText: '',
  courseList: [],
  // 当前选中的班级信息
  currentCourseDetail: [],
  // 模态框可见性
  courseDetailModalVisible: false,
  page: 1,
  count: 10,
  total: 0
})

// 搜索用户管理的课程
const searchManageCourse = async () => {
  const res = await getManageCourse(data.searchText, data.page, data.count)
  data.courseList = res.data.list
}

// 查看课程详情
const getCourseDetail = (courseDetail: any) => {
  data.courseDetailModalVisible = true;
  data.currentCourseDetail = courseDetail;
}

// 查看考试安排
const getExamDetail = (courseDetail: any) => {

}

onMounted(() => {
  // 挂载管理课程列表
  searchManageCourse()
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
        <el-button type="primary" class="mr-3" @click="searchManageCourse()">搜索</el-button>
      </div>

      <!-- 所有班级列表展示 -->
      <div class="course-list">
        <el-table :data="data.courseList" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="50" />
          <el-table-column prop="name" label="班级名"/>
          <el-table-column prop="course_name" label="课程名"/>
          <el-table-column prop="capacity" label="学生数量"/>
          <el-table-column prop="start_time" label="启止时间"/>
          <el-table-column prop="college_name" label="地区名"/>
          <!-- 右侧固定列 展示详情信息 -->
          <el-table-column fixed="right" label="操作" min-width="60">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="getCourseDetail(scope.row)">班级详情</el-button>
              <el-button link type="primary" size="small" @click="getExamDetail(scope.row)">考试安排</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
      </div>
    </div>
  </div>

    <!-- 班级详情模态框 -->
    <el-dialog v-model="data.courseDetailModalVisible" title="班级详细信息" width="600">
    <div class="course-detail-dialog">
      <el-form :model="data.currentCourseDetail" class="w-[40rem]">
        <!-- 班级名 -->
        <el-form-item label="班级名:">
          <span>{{ data.currentCourseDetail.name }}</span>
        </el-form-item>
        <!-- 教师名 -->
        <el-form-item label="教师名:">
          <span>{{ data.currentCourseDetail.teacher_name }}</span>
        </el-form-item>
        <!-- 课程名: -->
        <el-form-item label="课程名:">
          <span>{{ data.currentCourseDetail.course_name }}</span>
        </el-form-item>
        <!-- 容量 -->
        <el-form-item label="容量:">
          <span>{{ data.currentCourseDetail.capacity }}</span>
        </el-form-item>
        <!-- 起止时间 -->
        <el-form-item label="起止时间:">
          <span>{{ data.currentCourseDetail.start_time + '--' + data.currentCourseDetail.end_time}}</span>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item label="描述:">
          <span>{{ data.currentCourseDetail.desc }}</span>
        </el-form-item>
        <!-- 教学单位名 -->
        <el-form-item label="教学单位名:">
          <span>{{ data.currentCourseDetail.college_name }}</span>
        </el-form-item>
      </el-form>
    </div>
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

.select-course {
  @apply flex flex-row;
}

.course-list {
  @apply flex flex-col mt-4 mr-2;
}
</style>
