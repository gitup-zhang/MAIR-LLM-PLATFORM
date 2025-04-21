<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { getStudentReportList, createCourseReport } from '@/apis/report';

const route = useRoute();
const data = reactive({
  searchText: '',
  fileLimit: 1,
  fileUploadUrl: '' as any,
  courseReportList: [],
  currentReportDetail:[] as any,
  // 新建报告表单
  newCourseReportForm: {
    title: '',
    content: '',
    files_info: [] as any,
    subcourse_id: route.query.subcourseId,
    class_id: route.query.courseId,
    status: 1
  },
  courseId: route.query.courseId,
  subcourseId: route.query.subcourseId,
  page: 1,
  count: 6,
  total: 0,
  reportDetailModalVisible: false,
  searchUserReportLoading: false,
  submitCourseReportCreateLoading: false,
})

// 获取报告
const searchUserReport = async () => {
  data.searchUserReportLoading = true;
  const res = await getStudentReportList(Number(data.subcourseId), Number(data.courseId), data.searchText, data.page, data.count);
  data.courseReportList = res.data.list;
  data.total = res.data.total;
  data.searchUserReportLoading = false;
}
// 分页
const reportSizeChange = (val: any) => {
  searchUserReport();
}
const reportCurrentChange = (val: any) => {
  data.page = val;
  searchUserReport();
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
    file_id: res.data.file_id
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
  // 输入内容校验，报告标题、内容不能为空
  if (!data.newCourseReportForm.title || data.newCourseReportForm.title.trim() === '') {
    ElMessage.error('请输入报告标题');
    return;
  }
  if (!data.newCourseReportForm.content || data.newCourseReportForm.content.trim() === '') {
    ElMessage.error('请输入报告内容');
    return;
  }
  data.submitCourseReportCreateLoading = true;
  const res = await createCourseReport(data.newCourseReportForm);
  console.log(res);
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
  data.submitCourseReportCreateLoading = false;
  searchUserReport();
}

// 下载文件
const downloadFile = (fileUrl: string) => {
  window.open(fileUrl);
}

onMounted(async () => {
  // 挂载报告列表
  searchUserReport();
  data.fileUploadUrl = 'http://8.155.19.142:30027/olexp_server/file/';
  
})
</script>

<template>
  <el-row class="course-report-page">
    <!-- 报告列表展示 -->
    <el-col :span="16" class="page-left">
      <div class="report-list">
        <!-- 搜索框 -->
        <div class="search-box">
          <div class="report-title">班级报告</div>
          <el-input v-model="data.searchText" class="w-[20vw] h-[2rem]" placeholder="请输入标题" />
          <el-button type="primary" class="ml-3" @click="searchUserReport()" :loading="data.searchUserReportLoading">搜索</el-button>
        </div>
        <!-- 报告展示 -->
        <div class="report-table-list" v-loading="data.searchUserReportLoading">
          <el-empty v-if="data.courseReportList.length === 0 && !data.searchUserReportLoading" description="暂无班级报告信息" />
          <el-table v-else :data="data.courseReportList" border style="width: 100%">
            <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip/>
            <el-table-column label="文件" min-width="200" show-overflow-tooltip>
              <template v-slot="scope" >
                <el-button link type="primary" size="small" @click="downloadFile(scope.row.files_info[0].url)">
                  {{ scope.row.files_info[0].name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="发表时间" min-width="200" show-overflow-tooltip/>
            <el-table-column fixed="right" label="操作" min-width="60">
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
            :total="data.total" 
            :page-size="data.count"
            @size-change="reportSizeChange"
            @current-change="reportCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </div>
    </el-col>
    <!-- 创建新报告 -->
    <el-col :span="8" class="create-report">
      <el-input 
        v-model="data.newCourseReportForm.title" 
        placeholder="请输入标题(不能超过30个字)" 
        class="mb-2"
        show-word-limit="true"
        maxlength="30"
      ></el-input>
      <el-input
        v-model="data.newCourseReportForm.content"
         :autosize="{ minRows: 6, maxRows: 12 }"
        type="textarea"
        placeholder="请输入内容(不能超过500个字)"
        maxlength="500"
        show-word-limit="true"
        class="mb-2"
      />
      <!-- 上传按钮 -->
      <el-upload
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
      <el-button type="primary" class="report-btn mr-3" @click="submitCourseReportCreate" :loading="data.submitCourseReportCreateLoading">创建报告</el-button>
    </el-col>
  </el-row>

  <!-- 报告详情框 -->
  <!-- eslint-disable vue/no-multiple-template-root -->
  <el-dialog v-model="data.reportDetailModalVisible" title="报告详情" width="600" center>
    <el-descriptions direction="vertical" :column="4" border>
      <el-descriptions-item label="班级名" :span="2">{{ data.currentReportDetail.class_name }}</el-descriptions-item>
      <el-descriptions-item label="报告内容" :span="2">{{ data.currentReportDetail.content }}</el-descriptions-item>
      <el-descriptions-item label="发表时间" :span="4">{{ data.currentReportDetail.create_time }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>

</template>

<style scoped>
/* 页面整体设置 */
.course-report-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
/* 页面左侧 */
.page-left {
  width: 100%;
  height: 100%;
}
.report-list {
  width: 100%;
  height: 100%;
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
/* 页面右侧 */
.create-report {
  width: 100%;
  height: 100%;
  @apply p-3 rounded-md;
}
/* 按钮 */
.report-btn {
  width: 100%;
}
.report-table-list {
  @apply flex flex-col mt-4 mr-2;
}
</style>
