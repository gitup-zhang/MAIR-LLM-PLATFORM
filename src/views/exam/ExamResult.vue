<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router'
import { getStuExamPaperList } from '@/apis/exam'

const route = useRoute();
const data = reactive({
  searchText: '',
  examId: route.query.id,
  examResultList: [],
  page: 1,
  count: 10,
  total: 0
})

// 检索学生试卷
const searchStudentExam = async () => {
  const res = await getStuExamPaperList(Number(data.examId), data.searchText, data.page, data.count);
  data.examResultList = res.data.list;
}

// 试卷批改
const gradeExamPaper = (examPaperDetail: any) => {

}

const checkExamPaper = (examPaperDetail: any) => {

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
      <div class="select-exam-result">
        <!-- 搜索 -->
        <el-input v-model="data.searchText" style="width: 240px" class="mr-3" placeholder="请输入学号" />
        <el-button type="primary" class="mr-3" @click="searchStudentExam()">搜索</el-button>
      </div>

      <!-- 所有学生试卷信息展示 -->
      <div class="exam-result-list">
        <el-table :data="data.examResultList" border style="width: 100%">
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="user_id_number" label="学号"/>
          <el-table-column prop="user_name" label="学生姓名"/>
          <el-table-column prop="exam_desc" label="考试描述"/>
          <el-table-column prop="status_desc" label="考试状态"/>
          <el-table-column prop="score" label="当前得分"/>
          <!-- 右侧固定列 展示详情信息 -->
          <el-table-column fixed="right" label="操作" min-width="60">
            <template v-slot="scope">
              <el-button v-if="scope.row.status === 3" link type="primary" size="small" @click="gradeExamPaper(scope.row)">试卷批改</el-button>
              <el-button link type="primary" size="small" @click="checkExamPaper(scope.row)">查看试卷</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
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
  @apply flex flex-col;
}
.select-exam-result {
  @apply flex flex-row;
}
.exam-result-list {
  @apply flex flex-col mt-4 mr-2;
}
</style>
