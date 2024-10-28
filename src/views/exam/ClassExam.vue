<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { getExamList } from '@/apis/exam'

const route = useRoute();
const router = useRouter();
const data = reactive({
  searchText: '',
  page: 1,
  count: 10,
  total: 0,
  courseId: Number(route.query.id),
  examList: []
});

// 搜索考试安排列表
const searchExam = async () => {
  const res = await getExamList(data.searchText, data.courseId, data.page, data.count)
  data.examList = res.data.list;
  data.total = res.data.total;
}

// 考试结果
const checkExamResult = (examDetail: any) => {
  router.push({
    path: "/examResult",
    query: {
      id: examDetail.id
    }
  })
}

onMounted(() => {
  // 挂载考试数据
  searchExam();
})

</script>

<template>
  <div class="exam-page">
    <div class="exam-main">
      <!-- 检索考试 -->
      <div class="select-exam">
        <!-- 搜索 -->
        <el-input v-model="data.searchText" style="width: 240px" class="mr-3" placeholder="请输入考试名称" />
        <el-button type="primary" class="mr-3" @click="searchExam()">搜索</el-button>
      </div>

      <!-- 所有考试安排信息展示 -->
      <div class="exam-list">
        <el-table :data="data.examList" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="50" />
          <el-table-column prop="desc" label="描述"/>
          <el-table-column prop="exam_paper_title" label="试卷"/>
          <el-table-column prop="type_desc" label="类型"/>
          <el-table-column prop="end_time" label="有效时间"/>
          <!-- 右侧固定列 展示详情信息 -->
          <el-table-column fixed="right" label="操作" min-width="60">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="checkExamResult(scope.row)">考试结果</el-button>
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
.exam-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.exam-main {
  @apply flex flex-col;
}
.select-exam {
  @apply flex flex-row;
}
.exam-list {
  @apply flex flex-col mt-4 mr-2;
}
</style>
