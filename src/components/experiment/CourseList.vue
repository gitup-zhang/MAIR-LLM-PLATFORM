<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getClassList } from '@/apis/experiment'
import ExperimentDetail from '@/components/modal/ExperimentDetail.vue'

const classList = ref([])
const page = 1;
const count = 6;

// 自定义课程列表
const courseList = ref([
  {
    courseName: '计算机组成原理',
    courseTotalTime: 3
  },
  {
    courseName: '深度学习',
    courseTotalTime: 4
  }
])

// onMounted(async () => {
//   const data = await getClassList('study', 1, 6);
//   console.log('@@@', data)
// })
</script>

<template>
  <div class="course-page">
    <el-row>
      <el-col :span="8">
        <!-- 课程卡片 -->
        <el-card body-style="padding:0px" class="course-card">
          <!-- 配图 -->
          <img src="@/assets/img/course.png" style="width: 100%"/>
          <div class="course-card-main">
            <span class="course-title">计算机组成原理</span>
            <el-button type='primary' text>3课时</el-button>
            <ExperimentDetail>
              <el-button type='primary' text>进入课程</el-button>
            </ExperimentDetail>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <!-- 课程卡片 -->
        <el-card body-style="padding:0px" class="course-card">
          <!-- 配图 -->
          <img src="@/assets/img/course.png" style="width: 100%"/>
          <div class="course-card-main">
            <span class="course-title">计算机组成原理</span>
            <el-button type='primary' text>3课时</el-button>
            <el-button type='primary' text>进入课程</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <!-- 课程卡片 -->
        <el-card body-style="padding:0px" class="course-card">
          <!-- 配图 -->
          <img src="@/assets/img/course.png" style="width: 100%"/>
          <div class="course-card-main">
            <span class="course-title">计算机组成原理</span>
            <el-button type='primary' text>3课时</el-button>
            <el-button type='primary' text>进入课程</el-button>  
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <!-- 课程卡片 -->
        <el-card body-style="padding:0px" class="course-card">
          <!-- 配图 -->
          <img src="@/assets/img/course.png" style="width: 100%"/>
          <div class="course-card-main">
            <span class="course-title">计算机组成原理</span>
            <el-button type='primary' text>3课时</el-button>
            <el-button type='primary' text>进入课程</el-button>  
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<style scoped>
/* 整体页面设置 */
.course-page {
  height: 100%;
  width: inherit;
  @apply bg-green-50 p-3;
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
  /* @apply flex; */
}
.course-title {
  display: block;
}
/* .course-btn {
  padding: 0;
  float: right
} */
</style>
