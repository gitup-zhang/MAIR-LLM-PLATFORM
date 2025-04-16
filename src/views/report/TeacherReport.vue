<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getStudentReportList } from '@/apis/report';

const route = useRoute();
const data = reactive({
  searchText: '',
  courseReportList: [],
  currentReportDetail:[] as any,
  courseId: route.query.courseId,
  subcourseId: route.query.subcourseId,
  reportPage: 1,
  reportCount: 10,
  reportTotal: 0,
  reportDetailModalVisible: false,
  searchUserReportLoading: false,
})

// 获取报告
const searchUserReport = async () => {
  data.searchUserReportLoading = true;
  const res = await getStudentReportList(Number(data.subcourseId), Number(data.courseId), data.searchText, data.reportPage, data.reportCount);
  data.courseReportList = res.data.list;
  data.reportTotal = res.data.total;
  data.searchUserReportLoading = false;
}
// 考试安排分页
const reportSizeChange = (val: any) => {
    searchUserReport();
}
const reportCurrentChange = (val: any) => {
  data.reportPage = val;
  searchUserReport();
}

// 查看报告详情
const getReportDetail = async (reportDetail: any) => {
  // 打开报告详情模态框
  data.reportDetailModalVisible = true;
  data.currentReportDetail = reportDetail;
}

// 下载文件
const downloadFile = (fileUrl: string) => {
  window.open(fileUrl);
}

onMounted(async () => {
  // 挂载报告列表
  searchUserReport();
})
</script>

<template>
  <div class="report-page">
    <!-- 报告列表展示 -->
    <div class="report-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <div class="search-title">班级报告</div>
        <!-- <el-input v-model="data.searchText" class="w-[20vw] h-[2rem]" placeholder="请输入标题" />
        <el-button type="primary" class="ml-3" @click="searchUserReport()" :loading="data.searchUserReportLoading">搜索</el-button> -->
      </div>
      <div class="report-list">
        <!-- 报告展示 -->
        <el-empty v-if="data.courseReportList.length === 0" description="暂无班级报告信息" />
        <el-table v-else :data="data.courseReportList" border style="width: 100%" max-height="400">
          <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip/>
          <el-table-column label="文件" min-width="350" show-overflow-tooltip>
            <template v-slot="scope" >
              <el-button link type="primary" size="small" @click="downloadFile(scope.row.files_info[0].url)">
                {{ scope.row.files_info[0].name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="学生姓名(ID)" min-width="150" show-overflow-tooltip>
            <template v-slot="scope" >
              <span>{{ scope.row.user_name }}({{scope.row.user_id}})</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="发表时间" min-width="200" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" min-width="200">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="getReportDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          v-if="data.courseReportList.length !== 0"
          background 
          layout="prev, pager, next"
          :total="data.reportTotal" 
          :page-size="data.reportCount"
          @size-change="reportSizeChange"
          @current-change="reportCurrentChange"
          class="mt-4 mx-auto"
        />
      </div>
    </div>
  </div>

  <!-- 报告详情框 -->
  <el-dialog v-model="data.reportDetailModalVisible" title="报告详情" width="600" center>
    <div class="report-dialog">
      <el-descriptions direction="vertical" :column="4" border>
        <el-descriptions-item label="班级名" :span="2">{{ data.currentReportDetail.class_name }}</el-descriptions-item>
        <el-descriptions-item label="报告标题" :span="2">{{ data.currentReportDetail.content }}</el-descriptions-item>
        <el-descriptions-item label="发表时间" :span="4">{{ data.currentReportDetail.create_time }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>

</template>

<style scoped>
/* 页面整体设置 */
.report-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.report-container {
  position: relative;
  @apply flex flex-col;
}
.search-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md mb-3;
}
.search-title {
  position: absolute;
  left: 2rem;
  @apply text-2xl italic font-semibold text-light-50;
}
.report-list {
  @apply flex flex-col mt-4 mr-2;
}
/* 模态框 */
.report-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
