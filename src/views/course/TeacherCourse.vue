<script setup lang="ts">
// 教师课程页
import { onMounted, reactive, ref } from "vue"
import { getCourseList, getCourseApplyRecord, deleteCourseApply } from '@/apis/course'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const data = reactive({
  searchText: '',
  // 全部班级信息
  courseList: [],
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

onMounted(() => {
  // 初始化课程
  searchCourse();
})


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
const courseList = [
  {
    id: '1',
    className: '大数据1班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '2',
    className: '大数据2班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '3',
    className: '大数据3班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '4',
    className: '大数据4班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '5',
    className: '大数据5班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '6',
    className: '大数据6班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '7',
    className: '大数据7班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '8',
    className: '大数据8班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '9',
    className: '大数据9班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '10',
    className: '大数据10班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '11',
    className: '大数据11班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  },
    {
    id: '12',
    className: '大数据12班',
    courseName: '深度学习基础',
    teacherName: '张三',
    studentNumber: '24/36',
    date: '2024/10/5-2024/10/7',
    eduName: '计算机学院',
    applyStatus: '申请成功',
    operate: '详情',
  }
]
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
          <!-- 筛选课程类型 -->
          <el-select
            v-model="course"
            clearable
            placeholder="选择课程类型"
            style="width: 140px"
            class="mr-3"
          >
            <el-option
              v-for="item in coursesType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- 筛选申请状态 -->
          <el-select
            v-model="apply"
            clearable
            placeholder="选择申请状态"
            style="width: 140px"
          >
            <el-option
              v-for="item in applyStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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

      <el-divider />

      <h3 class="heading">已报名班级</h3>
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
  </div>

  <!-- 班级详情模态框 -->
  <el-dialog v-model="data.courseDetailVisible" title="班级详细信息" width="600">
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

  <!-- 班级申请记录模态框 -->
  <el-dialog v-model="data.courseApplyDetailVisible" title="课程申请记录" width="800">
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

/* 主内容区域 */
.banner {
  width: 100%;
  height: 20%;
  @apply rounded-md;
}
.course-main {
  @apply flex flex-col mt-3;
}
.select-course {
  @apply flex flex-row;
}
.course-list {
  @apply flex flex-col mt-4 mr-2;
}

.heading {
  @apply text-xl font-semibold ml-2 text-sky-400;
}

/* 班级详情模态框 */
.course-detail-dialog {

}
</style>
