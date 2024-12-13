<script setup lang="ts">
import { onMounted, reactive } from "vue"
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';
import { getCourseList, getCourseApplyRecord, deleteCourseApply, getEnrolledClassList } from '@/apis/course'
import { useUserStore } from '@/stores/user';
import { attentClass } from '@/apis/class';

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
  // 分页
  classPage: 1,
  classCount: 10,
  classTotal: 0,
  applyPage: 1,
  applyCount: 10,
  applyTotal: 0,
  enrolledClassPage: 1,
  enrolledClassCount: 10,
  enrolledClassTotal: 0,
  courseDetailVisible: false,
  courseApplyDetailVisible: false
})

// 获取班级列表
const searchCourse = async () => {
  const res = await getCourseList(data.searchText, data.classPage, data.classCount);
  data.courseList = res.data.list;
  data.classTotal = res.data.total;
}
// 查看班级详情
const getCourseDetail = (courseDetail: any) => {
  data.courseDetailVisible = true;
  data.currentCourseDetail = courseDetail;
}
// 申请新班级
const applyNewClass = async (id: number) => {
  const res = await attentClass(id);
  if(res.status === 0){
    ElMessage({
      message: '班级申请已发送，请等待审核',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '班级申请发送失败，请重新提交',
      type: 'warning',
      plain: true,
    })
  }
  searchCourse();
  getEnrolledClass();
}
// 班级分页
const classSizeChange = (val: any) => {
  searchCourse();
}
const classCurrentChange = (val: any) => {
  data.classPage = val;
  searchCourse();
}

// 查看班级申请记录
const getCourseApplyDetail = async () => {
  data.courseApplyDetailVisible = true;
  const res = await getCourseApplyRecord(userStore.id, data.applyPage, data.applyCount);
  data.courseApplyList = res.data.list;
  data.applyTotal = res.data.total;
}
// 取消申请
const removeCourseApply = async (applyId:number) => {
  const res = await deleteCourseApply(applyId);
  if(res.status === 0){
    ElMessage({
      message: '班级申请删除',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '班级申请删除失败',
      type: 'warning',
      plain: true,
    })
  }
  searchCourse();
  getCourseApplyDetail()
}
// 申请记录分页
const applySizeChange = (val: any) => {
    getCourseApplyDetail();
}
const applyCurrentChange = (val: any) => {
  data.applyPage = val;
  getCourseApplyDetail();
}

// 获取已经报名的班级列表
const getEnrolledClass = async () => {
  const res = await  getEnrolledClassList(data.enrolledClassPage, data.enrolledClassCount);
  data.enrolledClassList = res.data.list;
  data.enrolledClassTotal = res.data.total;
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
// 已报名的班级列表分页
const enrolledClassSizeChange = (val: any) => {
    getEnrolledClass();
}
const enrolledClassCurrentChange = (val: any) => {
  data.enrolledClassPage = val;
  getEnrolledClass();
}

onMounted(() => {
  // 挂载课程信息
  searchCourse();
  // 挂载已经报名的课程信息
  getEnrolledClass();
})
</script>

<template>
  <div class="course-page">
    <el-tabs v-model="data.activeName" type="border-card" class="class-tabs">
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
            <el-empty v-if="data.courseList.length === 0" description="暂无班级信息" />
            <el-table v-if="data.courseList.length !== 0" :data="data.courseList" border style="width: 100%">
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
                  <el-button v-if="scope.row.can_apply" link type="primary" size="small" @click="applyNewClass(scope.row.id)">班级申请</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              v-if="data.courseList.length !== 0"
              background 
              layout="prev, pager, next"
              :total="data.classTotal" 
              :page-size="data.classCount"
              @size-change="classSizeChange"
              @current-change="classCurrentChange"
              class="mt-4 mx-auto"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已报名班级信息" name="second">
        <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
        <div class="course-main">
          <!-- 班级列表 -->
          <div class="course-list">
            <el-empty v-if="data.enrolledClassList.length === 0" description="暂无已报名班级信息" />
            <el-table v-if="data.enrolledClassList.length !== 0" :data="data.enrolledClassList" border style="width: 100%">
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
            <el-pagination
              v-if="data.enrolledClassList.length !== 0"
              background 
              layout="prev, pager, next"
              :total="data.enrolledClassTotal" 
              :page-size="data.enrolledClassCount"
              @size-change="enrolledClassSizeChange"
              @current-change="enrolledClassCurrentChange"
              class="mt-4 mx-auto"
            />
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
    >
      <el-descriptions-item label="班级名" :span="2">{{ data.currentCourseDetail.name }}</el-descriptions-item>
      <el-descriptions-item label="教师名" :span="2">{{ data.currentCourseDetail.teacher_name }}</el-descriptions-item>
      <el-descriptions-item label="课程名" :span="2">{{ data.currentCourseDetail.course_name }}</el-descriptions-item>
      <el-descriptions-item label="容量" :span="2">{{ data.currentCourseDetail.capacity }}</el-descriptions-item>
      <el-descriptions-item label="教学单位名" :span="4">{{ data.currentCourseDetail.college_name }}</el-descriptions-item>
      <el-descriptions-item label="起止时间" :span="4">{{ data.currentCourseDetail.start_time + '--' + data.currentCourseDetail.end_time}}</el-descriptions-item>
      <el-descriptions-item label="描述" :span="4">{{ data.currentCourseDetail.desc }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <!-- 班级申请记录模态框 -->
  <el-dialog v-model="data.courseApplyDetailVisible" title="课程申请记录" width="800" center>
    <div class="student-class-dialog">
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
      <!-- 分页 -->
      <el-pagination
        background 
        layout="prev, pager, next"
        :total="data.applyTotal" 
        :page-size="data.applyCount"
        @size-change="applySizeChange"
        @current-change="applyCurrentChange"
        class="mt-4 mx-auto"
      />
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
/* 模态框 */
.student-class-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
