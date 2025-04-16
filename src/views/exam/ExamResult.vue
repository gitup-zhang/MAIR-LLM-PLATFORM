<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { getStuExamPaperList } from '@/apis/exam'

const route = useRoute();
const router = useRouter();
const data = reactive({
  searchText: '',
  examId: route.query.id,
  examResultList: [],
  page: 1,
  count: 6,
  total: 0,
  searchStudentExamLoading: false,
})

// 检索学生试卷
const searchStudentExam = async () => {
  data.searchStudentExamLoading = true;
  if(data.searchText.length > 0){
    data.page = 1;
  }
  const res = await getStuExamPaperList(Number(data.examId), data.searchText, data.page, data.count);
  data.examResultList = res.data.list;
  data.total = res.data.total;
  data.searchStudentExamLoading = false;
}

// 分页
const examSizeChange = (val: any) => {
  searchStudentExam();
}
const examCurrentChange = (val: any) => {
  data.page = val;
  searchStudentExam();
}

// 试卷批改
const gradeExamPaper = (examPaperDetail: any) => {
  router.push({
    path: "/examPaperDetail",
    query: {
      id: examPaperDetail.id,
      type: 'teacher'
    }
  })
}
// 查看试卷
const checkExamPaper = (examPaperDetail: any) => {
  router.push({
    path: "/examPaperDetail",
    query: {
      id: examPaperDetail.id,
      type: 'teacher'
    }
  })
}

onMounted(() => {
  // 挂载学生考试数据
  searchStudentExam();
})
</script>

<template>
  <div class="exam-result-page">
    <div class="exam-result-main">
      <!-- 检索学生试卷 -->
      <div class="search-box">
        <div class="exam-title">我的考试安排</div>
        <div class="select-exam">
          <!-- 搜索 -->
          <el-input v-model="data.searchText" style="width: 240px" class="mr-3" placeholder="请输入ID号" />
          <el-button type="primary" class="mr-3" @click="searchStudentExam()" :loading="data.searchStudentExamLoading">搜索</el-button>
        </div>
      </div>

      <!-- 所有学生试卷信息展示 -->
      <div class="exam-result-list">
        <el-table :data="data.examResultList" border style="width: 100%" max-height="400">
          <el-table-column prop="user_id_number" label="ID 号" min-width="200"/>
          <el-table-column prop="user_name" label="学生姓名" min-width="200"/>
          <el-table-column prop="exam_desc" label="考试描述" min-width="200"/>
          <el-table-column prop="status_desc" label="考试状态" min-width="200"/>
          <el-table-column prop="score" label="当前得分" min-width="200"/>
          <!-- 右侧固定列 展示详情信息 -->
          <el-table-column fixed="right" label="操作" min-width="200">
            <template v-slot="scope">
              <el-button v-if="scope.row.status === 3" link type="primary" size="small" @click="gradeExamPaper(scope.row)">试卷批改</el-button>
              <el-button link type="primary" size="small" @click="checkExamPaper(scope.row)">查看试卷</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          v-if="data.examResultList.length !== 0"
          background 
          layout="prev, pager, next"
          :total="data.total" 
          :page-size="data.count"
          @size-change="examSizeChange"
          @current-change="examCurrentChange"
          class="mt-4 mx-auto"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 整体页面设置 */
.exam-result-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.exam-result-main {
  position: relative;
  @apply flex flex-col;
}
.select-exam-result {
  @apply flex flex-row;
}
.exam-result-list {
  @apply flex flex-col mt-4 mr-2;
}
.search-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md;
}
.select-exam {
  @apply flex flex-row;
}
.exam-title {
  position: absolute;
  left: 2rem;
  @apply text-2xl italic font-semibold text-light-50;
}
.exam-title:hover {
  transform: scale(1.1);
}
</style>
