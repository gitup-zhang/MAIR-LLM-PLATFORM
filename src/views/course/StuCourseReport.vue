<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
// 引入图标
import { UploadFilled } from '@element-plus/icons-vue'
import { getUserReportList } from '@/apis/report'
import { useRoute } from 'vue-router'

const route = useRoute()

const data = reactive({
  searchText: '',
  courseReportList: [],
  courseId: route.query.courseId,
  subcourseId: route.query.subcourseId,
  page: 1,
  count: 10,
  total: 0
})

// 获取报告
const searchUserReport = async () => {
  const res = await getUserReportList(Number(data.subcourseId), Number(data.courseId), data.searchText, data.page, data.count);
  data.courseReportList = res.data.list;
}

onMounted(() => {
  // 挂载报告列表
  searchUserReport();
})


const testInput = ref('')
const textarea = ref('')
const fileList = ref([])
const reportData = ref([
  {
    id: '1',
    title: '测试',
    file: '无',
    time: '2024-09-20 10:19:54',
    operation: '无'
  }
])
</script>

<template>
  <el-row class="course-report-page">
    <el-col :span="16" class="page-left">
      <div class="report-list">
        <!-- 搜索框 -->
        <div class="search-box">
          <div class="report-title">班级报告</div>
          <div class="report-search">
            <el-input v-model="data.searchText" class="w-[20vw] h-[2rem]" placeholder="请输入标题" />
            <el-button type="primary" class="ml-3" @click="searchUserReport()">搜索</el-button>
          </div>
        </div>
        <!-- 报告展示 -->
        <el-table :data="data.courseReportList" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="title" label="标题" width="60" />
          <el-table-column label="文件">
            <template v-slot="scope" >
              <template v-for="(file, index) in scope.row.files_info">
                {{ file.name }}<br>
            </template>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="发表时间" />
          <el-table-column prop="operation" label="操作" />
        </el-table>
      </div>
    </el-col>
    <!-- 右侧 -->
    <el-col :span="8" class="create-report">
      <el-input v-model="testInput" placeholder="请输入标题" class="mb-2"></el-input>
      <el-input
        v-model="textarea"
        :rows="20"
        type="textarea"
        placeholder="请输入内容"
        class="mb-2"
      />
      <!-- 上传按钮 -->
      <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖动文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            上传单个文件，且文件大小不超过20MB
          </div>
        </template>
      </el-upload>
      <el-button type="primary" class="report-btn mr-3">创建报告</el-button>
    </el-col>
  </el-row>

</template>

<style scoped>
/* 页面整体设置 */
.course-report-page {
  width: 100%;
  height: 100%;
}
/* 页面左侧 */
.page-left {
  width: 100%;
  height: 100%;
  @apply bg-light-500 pr-1;
}
.report-list {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-3 rounded-md;
}
.search-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md mb-3;
}
.report-title {
  position: absolute;
  left: 2rem;
  @apply text-2xl italic font-semibold text-light-50;
}
.report-search {
  @apply ;
}
/* 页面右侧 */
.create-report {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-3 rounded-md;
}
.report-upload {
  width: 100%;
}
/* 按钮 */
.report-btn {
  width: 100%;
}
</style>
