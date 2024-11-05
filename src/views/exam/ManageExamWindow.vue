<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { getExamInfoList } from '@/apis/exam'
import { getExamPaperList } from '@/apis/examPaper'
import { getExamQuestionList } from '@/apis/examQuestion'
import { getExamResultList } from '@/apis/examResult'

const data = reactive({
  activeName: 'first',
  // 考试名称输入
  inputExamQuestion: '',
  inputExam: '',
  inputExamPaper: '',
  inputExamResultId: '',
  inputExamResultStuId: '',
  examList: [],
  examPaperList: [],
  examQuestionList: [],
  examResultList: [],
  page: 1,
  count: 10,
  total: 0
})

// 搜索考试
const searchExam = async () => {
  const res = await getExamInfoList(data.inputExam, data.page, data.count);
  data.examList = res.data.list;
}
// 搜索试卷
const searchExamPaper = async () => {
  const res = await getExamPaperList(data.inputExamPaper, data.page, data.count);
  data.examPaperList = res.data.list;
}
// 搜索试题
const searchExamQuestion = async () => {
  const res = await getExamQuestionList(data.inputExamQuestion, data.page, data.count);
  data.examQuestionList = res.data.list;
}
// 搜索考试结果
const searchExamResult = async () => {
  const res = await getExamResultList(data.inputExamResultId, data.inputExamResultStuId, data.page, data.count);
  data.examResultList = res.data.list;
}

onMounted(() => {
  // 挂载数据
  searchExam();
  searchExamPaper();
  searchExamQuestion();
  searchExamResult();
})
</script>

<template>
  <div class="education-page">
    <el-tabs v-model="data.activeName" type="border-card" class="education-tabs" @tab-click="handleClick">
      <el-tab-pane label="试题管理" name="first" class="education-pane">
        <div class="search-box">
          <div class="search-title">试题管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputExamQuestion" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入试题名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExamQuestion()">搜索</el-button>
          </div>
        </div>
        <!-- 所有试卷信息展示 -->
        <div class="show-list">
          <el-table :data="data.examQuestionList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="content" label="内容"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="type_desc" label="类型"/>
            <el-table-column prop="status_desc" label="状态"/>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button v-if="scope.row.status===3" link type="primary" size="small" @click="">修改</el-button>
                <el-button v-else-if="scope.row.status===1" link type="primary" size="small" @click="">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="试卷管理" name="second">
        <div class="search-box">
          <div class="search-title">试卷管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputExamPaper" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入试卷标题" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExamPaper()">搜索</el-button>
          </div>
        </div>
        <!-- 所有试卷信息展示 -->
        <div class="show-list">
          <el-table :data="data.examPaperList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="title" label="标题"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="status_desc" label="状态"/>
            <el-table-column prop="creator_name" label="创建者"/>
            <el-table-column prop="total_score" label="总分"/>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button v-if="scope.row.status===3" link type="primary" size="small" @click="">修改</el-button>
                <el-button v-if="scope.row.status===3" link type="primary" size="small" @click="">删除</el-button>
                <el-button v-else-if="scope.row.status===1" link type="primary" size="small" @click="">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="考试管理" name="third">
        <div class="search-box">
          <div class="search-title">考试管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputExam" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入考试名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExam()">搜索</el-button>
          </div>
        </div>
        <!-- 所有考试信息展示 -->
        <div class="show-list">
          <el-table :data="data.examList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="class_name" label="考试班级" width="150"/>
            <el-table-column prop="exam_paper_title" label="试卷标题"/>
            <el-table-column prop="type_desc" label="类型" width="100"/>
            <el-table-column label="考试时间">
              <template v-slot="scope">
                {{ scope.row.start_time + ' -- ' + scope.row.end_time }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="modityCollegeDetail(scope.row.id)">查看详情</el-button>
                <el-button v-if="scope.row.status===1" link type="primary" size="small" @click="removeExam(scope.row)">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="考试结果" name="Fourth">
        <div class="search-box">
          <div class="search-title">考试结果</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputExamResultId" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入考试ID" />
            <el-input v-model="data.inputExamResultStuId" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入学生学号" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExamResult()">搜索</el-button>
          </div>
        </div>
        <!-- 所有考试信息展示 -->
        <div class="show-list">
          <el-table :data="data.examResultList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="user_id_number" label="学号"/>
            <el-table-column prop="user_name" label="学生姓名" width="150"/>
            <el-table-column prop="exam_id" label="考试ID" width="100"/>
            <el-table-column prop="exam_desc" label="考试描述"/>
            <el-table-column prop="status_desc" label="考试状态" width="100"/>
            <el-table-column label="当前得分" width="100">
              <template v-slot="scope">
                {{ scope.row.score }} / {{ scope.row.total_score }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button v-if="scope.row.status === 3" link type="primary" size="small" @click="">查看试卷</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>
  </el-tabs>

  </div>

</template>

<style scoped>
/* 整体页面设置 */
.education-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.education-tabs {
  height: 100%;
  width: 100%;
}
.education-pane {
  height: 100%;
  width: 100%;
}
.search-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md;
}
.search-title {
  position: absolute;
  left: 2rem;
  @apply text-2xl italic font-semibold text-light-50;
}
.show-list {
  @apply flex flex-col mt-4 mr-2;
}
</style>
