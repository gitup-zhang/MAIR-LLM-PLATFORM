<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { getExamList, getUserExamId } from '@/apis/exam'
import { useUserStore } from '@/stores/user'

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const data = reactive({
  searchText: '',
  userType: userStore.roleId,
  courseId: Number(route.query.id),
  examList: [],
  examPage: 1,
  examCount: 10,
  examTotal: 0,
});

// 搜索考试安排列表
const searchExam = async () => {
  const res = await getExamList(data.searchText, data.courseId, data.examPage, data.examCount)
  data.examList = res.data.list;
  data.examTotal = res.data.total;
}
// 考试安排分页
const examSizeChange = (val: any) => {
  searchExam();
}
const examCurrentChange = (val: any) => {
  data.examPage = val;
  searchExam();
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
// 查看试卷
const checkExamDetail = async (id: number) => {
  const res = await getUserExamId(id);
  router.push({
    path: '/examPaperDetail/',
    query: {
      type: 'student',
      userExamId: res.data.user_exam_id
    }
  })
}
// 查看练习
const checkPracticeDetail = async (id: number) => {
    const res = await getUserExamId(id);
    router.push({
    path: '/examPaperDetail/',
    query: {
      type: 'student',
      userExamId: res.data.user_exam_id
    }
  })
}
// 进入考试
const enterExam = async (id: number) => {
    const res = await getUserExamId(id);
    router.push({
    path: '/examPaperDetail/',
    query: {
      type: 'student',
      userExamId: res.data.user_exam_id
    }
  })
}
// 进入练习
const enterPractice = async (id: number) => {
    const res = await getUserExamId(id);
    router.push({
    path: '/examPaperDetail/',
    query: {
      type: 'student',
      userExamId: res.data.user_exam_id
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
        <el-empty v-if="data.examList.length === 0" description="暂无考试安排信息"/>
        <el-table v-if="data.examList.length !== 0" :data="data.examList" border style="width: 100%">
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
                <el-button v-if="scope.row.type === 2" link type="primary" size="small" @click="checkExamDetail(scope.row.id)">查看试卷</el-button>
                <el-button v-if="scope.row.type === 1" link type="primary" size="small" @click="checkPracticeDetail(scope.row.id)">查看练习</el-button>
              </template>
              <template v-if="data.userType === 1 && scope.row.status === 4">
                <el-button v-if="scope.row.type === 2" link type="primary" size="small" @click="enterExam(scope.row.id)">进入考试</el-button>
                <el-button v-if="scope.row.type === 1" link type="primary" size="small" @click="enterPractice(scope.row.id)">进入练习</el-button>
              </template>
              <el-button v-if="data.userType === 3 || data.userType === 2" link type="primary" size="small" @click="checkExamResult(scope.row)">考试结果</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          v-if="data.examList.length !== 0"
          background 
          layout="prev, pager, next"
          :total="data.examTotal" 
          :page-size="data.examCount"
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
