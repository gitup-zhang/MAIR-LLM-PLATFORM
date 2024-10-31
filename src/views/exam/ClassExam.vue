<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { getExamList } from '@/apis/exam'
import { useUserStore } from '@/stores/user'

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const data = reactive({
  searchText: '',
  page: 1,
  count: 10,
  total: 0,
  userType: userStore.roleId,
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
      <div class="search-box">
        <div class="exam-title">我的考试安排</div>
        <div class="select-exam">
          <!-- 搜索 -->
          <el-input v-model="data.searchText" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入考试名称" />
          <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExam()">搜索</el-button>
        </div>
      </div>

      <!-- 所有考试安排信息展示 -->
      <div class="exam-list">
        <el-table :data="data.examList" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="50" />
          <el-table-column prop="desc" label="描述"/>
          <el-table-column prop="exam_paper_title" label="试卷"/>
          <el-table-column prop="type_desc" label="类型"/>
          <el-table-column label="有效时间">
            <template v-slot="scope">
              <span>{{ scope.row.start_time + ' —— ' + scope.row.end_time }}</span>
            </template>
          </el-table-column>
          <!-- 右侧固定列 展示详情信息 -->
          <el-table-column fixed="right" label="操作" min-width="60">
            <template v-slot="scope">
              <template v-if="data.userType === 1 && scope.row.status === 3">
                <el-button v-if="scope.row.type === 2" link type="primary" size="small" @click="">查看试卷</el-button>
                <el-button v-if="scope.row.type === 1" link type="primary" size="small" @click="">查看练习</el-button>
              </template>
              <template v-if="data.userType === 1 && scope.row.status === 4">
                <el-button v-if="scope.row.type === 2" link type="primary" size="small" @click="">进入考试</el-button>
                <el-button v-if="scope.row.type === 1" link type="primary" size="small" @click="">进入练习</el-button>
              </template>
              <el-button v-if="data.userType === 3 || data.userType === 2" link type="primary" size="small" @click="checkExamResult(scope.row)">考试结果</el-button>
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
  position: relative;
  @apply flex flex-col;
}
.exam-title {
  position: absolute;
  left: 2rem;
  @apply text-2xl italic font-semibold text-light-50;
}
.exam-title:hover {
  transform: scale(1.1);
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
.exam-list {
  @apply flex flex-col mt-4 mr-2;
}
</style>
