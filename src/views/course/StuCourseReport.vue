<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { getUserReportList, createCourseReport } from '@/apis/report';
import { getFileUploadUrl } from '@/apis/file';

const route = useRoute();
const data = reactive({
  searchText: '',
  fileLimit: 1,
  fileUploadUrl: '',
  courseReportList: [],
  currentReportDetail:[],
  // 新建报告表单
  newCourseReportForm: {
    id: -1,
    title: '',
    content: '',
    class_id: -1,
    files_info: [] as any,
    status: 1
  },
  courseId: route.query.courseId,
  subcourseId: route.query.subcourseId,
  page: 1,
  count: 10,
  total: 0,
  reportDetailModalVisible: false
})

// 获取报告
const searchUserReport = async () => {
  const res = await getUserReportList(Number(data.subcourseId), Number(data.courseId), data.searchText, data.page, data.count);
  data.courseReportList = res.data.list;
}

// 查看报告详情
const getReportDetail = async (reportDetail: any) => {
  // 打开报告详情模态框
  data.reportDetailModalVisible = true;
  data.currentReportDetail = reportDetail;
}
// 文件移除时的钩子
const handleRemove = (uploadFile: any, uploadFiles: any) => {
  if(!uploadFile.file_id){
    return;
  }
  for (let i = 0, len = data.newCourseReportForm.files_info.length; i < len; i++) {
    if (data.newCourseReportForm.files_info[i].url === uploadFile.url) {
      data.newCourseReportForm.files_info.splice(i, 1)
      break
    }
  }
}
// 删除文件之前的钩子，参数为上传的文件和文件列表
const beforeRemove = (uploadFile: any, uploadFiles: any) => {
  return true;
}
// 当超出限制时，执行的钩子函数
const handleExceed = (files: any, uploadFiles: any) => {
  ElMessage({
    message: `当前限制选择 ${data.fileLimit} 个文件，共选择了 ${files.length + uploadFiles.length} 个文件`,
    type: 'warning',
    plain: true,
  })
}
// 文件上传成功时的钩子
const handleSuccess = (res: any, file: any) => {
  data.newCourseReportForm.files_info.push({
    name: res.data.name,
    url: res.data.url,
    file_id: res.data.file_id,
    group_name: res.data.group_name
  })
}
// 上传文件之前的钩子
const beforeUpload = (rawFile: any) => {
  const isLimit20MB = rawFile.size / 1024 / 1024 < 20;
  if(! isLimit20MB){
    ElMessage({
      message: '上传单个文件且大小不能超过20MB',
      type: 'warning',
      plain: true,
    })
  }
}
// 创建新的课程报告
const submitCourseReportCreate = async () => {
  const res = await createCourseReport(data.newCourseReportForm);
  if(res.status === 0){
    ElMessage({
      message: '报告创建成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '报告创建失败',
      type: 'warning',
      plain: true,
    })
  }
  searchUserReport();
}

onMounted(async () => {
  // 挂载报告列表
  searchUserReport();
  const res = await getFileUploadUrl();
  data.fileUploadUrl = res.data;
})


// 测试数据
// const reportList = [
//   {
//     id: 1,
//     title: '测试1',
//     files_info: [
//       {
//         name: '文件1',
//         ulr: 'www.baidu.com'
//       }
//     ]
//   }
// ]
</script>

<template>
  <el-row class="course-report-page">
    <!-- 报告列表展示 -->
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
          <el-table-column prop="title" label="标题"/>
          <el-table-column label="文件">
            <template v-slot="scope" >
              <template v-for="(file, index) in scope.row.files_info">
                  {{ file.name }}<br>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="发表时间" />
          <el-table-column fixed="right" label="操作" min-width="60">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="getReportDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <!-- 创建新报告 -->
    <el-col :span="8" class="create-report">
      <el-input v-model="data.newCourseReportForm.title" placeholder="请输入标题" class="mb-2"></el-input>
      <el-input
        v-model="data.newCourseReportForm.content"
        :rows="20"
        type="textarea"
        placeholder="请输入内容"
        class="mb-2"
      />
      <!-- 上传按钮 -->
      <el-upload
        class="upload-demo"
        drag
        :action="data.fileUploadUrl"
        :on-remove="handleRemove" 
        :before-remove="beforeRemove" 
        :limit="data.fileLimit"
        :on-exceed="handleExceed" 
        :file-list="data.newCourseReportForm.files_info" 
        :on-success="handleSuccess" 
        :before-upload="beforeUpload"
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
      <el-button type="primary" class="report-btn mr-3" @click="submitCourseReportCreate">创建报告</el-button>
    </el-col>
  </el-row>

  <!-- 报告详情框 -->
  <el-dialog v-model="data.reportDetailModalVisible" title="报告详情" width="600" center>
    <el-descriptions direction="vertical" :column="4" border>
      <el-descriptions-item label="班级名" :span="2">{{ data.currentReportDetail.class_name }}</el-descriptions-item>
      <el-descriptions-item label="报告标题" :span="2">{{ data.currentReportDetail.content }}</el-descriptions-item>
      <el-descriptions-item label="发表时间" :span="4">{{ data.currentReportDetail.create_time }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>

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
