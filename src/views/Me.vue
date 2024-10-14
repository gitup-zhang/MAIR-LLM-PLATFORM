<script setup lang="ts">
import { ref } from "vue"
import { RouterLink, useRouter } from "vue-router"
import { DataBoard, SetUp, Document } from '@element-plus/icons-vue'

const user = '123213'
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
  <el-row class="me-page">
      <el-col :lg="20" class="left-main">
        <img src="../assets/img/banner.png" class="banner" alt="大模型实训平台">
          
        <!-- 课程搜索框 -->
        <div class="course-main">
          <div class="select-course">
            <!-- 搜索 -->
            <el-input v-model="input" style="width: 240px" class="mr-3" placeholder="请输入课程名称" />
            <el-button type="primary" class="mr-3">搜索</el-button>
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
          </div>

          <!-- 班级列表展示 -->
          <div class="course-list">
            <el-table :data="courseList" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="50" />
              <el-table-column prop="className" label="班级名"/>
              <el-table-column prop="courseName" label="课程名"/>
              <el-table-column prop="teacherName" label="教师名"/>
              <el-table-column prop="studentNumber" label="学生数量"/>
              <el-table-column prop="date" label="起止时间"/>
              <el-table-column prop="eduName" label="教学单位名"/>
              <el-table-column prop="applyStatus" label="申请状态"/>
              <!-- 右侧固定列 展示详情信息 -->
              <el-table-column fixed="right" label="操作" min-width="60">
                <template #default>
                  <el-button link type="primary" size="small">
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination layout="prev, pager, next" :total="50" />
          </div>
        </div>
      </el-col>

    <!-- 右侧 用户信息区 -->
    <el-col :lg="4" class="right-main">
        <div class="username">
          欢迎 {{user}} 用户登录
        </div>
        <div class="usertype">
          类型：学生用户
        </div>

        <!-- 用户信息概览 -->
        <el-row class="overview">
          <!-- 课程数量信息概览 -->
          <el-col :span="8">
            <div class="overview-title">
              课程数量
            </div>
            <div class="overview-content">
              <!-- 图标 -->
              <el-icon class="no-inherit text-sky-600">
                <DataBoard />
              </el-icon>
              8
            </div>
          </el-col>

          <!-- 实验数量信息概览 -->
          <el-col  :span="8">
            <div class="overview-title">
              实验次数
            </div>
            <div class="overview-content">
              <!-- 图标 -->
              <el-icon class="no-inherit text-sky-600">
                <SetUp />
              </el-icon>
              3
            </div>
          </el-col>

          <el-col  :span="8" class="overview-title">
            <div class="overview-title">
              考试数量
            </div>
            <div class="overview-content">
              <!-- 图标 -->
              <el-icon class="no-inherit text-sky-600">
                <Document />
              </el-icon>
              2
            </div>
          </el-col>
        </el-row>
        <!-- 与大模型对话按钮 -->
        <el-button type="primary" class="font-bold">与大模型对话</el-button>
    </el-col>
  </el-row>
</template>

<style scoped>
/* 整体页面设置 */
.me-page {
  width: 100%;
  height: 100%;
  @apply bg-light-50 p-1;
}

/* 左侧区域 */
.left-main {
  width: 100%;
  height: 100%;
}
.banner {
  width: 70%;
  height: 20%;
  border-radius: 15px;
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


/* 右侧区域 */
.right-main {
  width: 100%;
  height: 100%;
  @apply bg-sky-50 flex flex-col p-3;
}
.username {
  @apply text-xl font-semibold text-sky-400;
}
.usertype {
  @apply text-base text-sky-400;
}
.overview {
  width: 100%;
  @apply mt-3 mb-3;
}
.overview-title {
  @apply text-sky-400 text-sm ;
}
.overview-content{
  @apply text-sky-600 text-xl;
}
</style>
