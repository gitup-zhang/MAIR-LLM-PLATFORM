<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, UploadFilled } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/user';
import { getFileUploadUrl } from '@/apis/file';
import { getStuStudyProgessDetail, getTeacherStudyProgessDetail } from '@/apis/record';
import { getClassList, getCourseDetailInfo } from '@/apis/experiment';
import { getNotificationList, deleteNotification, createNotification } from '@/apis/notification';

const userStore = useUserStore();
const router = useRouter();
const data = reactive({
  fileUploadUrl: '',
  fileLimit: 1,
  // 是否可以操作
  canOperate: false,
  // 当前实验 ID
  currentExperimentId: -1,
  // 输入
  inputNotification: '',
  // 列表
  notificationList: [],
  courseList: [],
  studyProgressList: [],
  subcourseList: [],
  // 新表单
  newNotificationForm: {
    content: '',
    class_id: -1,
    files_info: [] as any
  },
  // 模态框
  experimentDetailModalVisible: false,
  classNotificationModalVisible: false,
  createNotificationModalVisible: false,
  studyProgressModalVisible: false,
  page: 1,
  count: 6,
  total: 0
})

// 获取课程列表
const getCourseList = async () => {
  const res = await getClassList('study', data.page, data.count);
  data.courseList = res.data.list;
}
// 获取课程详情
const getCourseDetail = async (courseId:number, page:number, count:number) => {
  const res = await getCourseDetailInfo(courseId, page, count);
  data.subcourseList = res.data.list;
}
// 进入课程
const openExperimentDetailModal = (courseId: number) => {
  data.currentExperimentId = courseId;
  data.experimentDetailModalVisible = true;
  getCourseDetail(courseId, 1, 10);
}
// 进入学生课程报告页面
const openStuReport = (courseId: number, subcourseId: number) => {
  data.experimentDetailModalVisible = false
  router.push({
    path: "/studentReport",
    query: {
      courseId: courseId, 
      subcourseId: subcourseId
    }
  })
}

// 搜索班级通知
const searchNotification = async (classId: number) => {
  const res = await getNotificationList(classId, data.inputNotification, data.page, data.count);
  data.notificationList = res.data.list;
  data.total = res.data.total;
}
// 打开班级通知列表
const openClassNotificationModal = (id: number) => {
  data.classNotificationModalVisible = true;
  data.currentExperimentId = id;
  searchNotification(id);
}
// 删除通知
const removeNotification = async (id: number) => {
  const res = await deleteNotification(id);
  if(res.status === 0){
    ElMessage({
      message: '消息删除成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '消息删除失败',
      type: 'warning',
      plain: true,
    })
  }
  searchNotification(data.currentExperimentId);
}
// 打开创建通知模态框
const openCreateNotificationModal = () => {
  data.createNotificationModalVisible = true;
  data.newNotificationForm.class_id = data.currentExperimentId;
}
// 文件移除时的钩子
const handleRemove = (uploadFile: any, uploadFiles: any) => {
  if(!uploadFile.file_id){
    return;
  }
  for (let i = 0, len = data.newNotificationForm.files_info.length; i < len; i++) {
    if (data.newNotificationForm.files_info[i].url === uploadFile.url) {
      data.newNotificationForm.files_info.splice(i, 1)
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
  data.newNotificationForm.files_info.push({
    name: res.data.name,
    url: res.data.url,
    file_id: res.data.file_id,
    group_name: res.data.group_name
  })
}
// 上传文件之前的钩子
const beforeUpload = (rawFile: any) => {
  const isLimit20MB = rawFile.size / 1024 / 1024 < 20
  if(! isLimit20MB){
    ElMessage({
      message: '上传单个文件且大小不能超过20MB',
      type: 'warning',
      plain: true,
    })
  }
}
// 提交通知创建
const submitNotificationCreate = async () => {
  const res = await createNotification(data.newNotificationForm);
  if(res.status === 0){
    ElMessage({
      message: '消息创建成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '消息创建失败',
      type: 'warning',
      plain: true,
    })
  }
  searchNotification(data.currentExperimentId);
} 
// 打开学习进度框
const openStudyProgressModal = async (id: number) => {
  data.studyProgressModalVisible = true;
  if(userStore.roleId > 1){
    const res = await getTeacherStudyProgessDetail(id, data.currentExperimentId, data.page, data.count);
    data.studyProgressList = res.data.list;
  } else {
    const res = await getStuStudyProgessDetail(id, data.currentExperimentId, data.page, data.count)
    data.studyProgressList = res.data.list;
  }
}
// 进入实验
const openExperiment = () => {
  data.experimentDetailModalVisible = false
  window.open('http://8.155.19.142:30049/lab?')
}

onMounted( async () => {
  // 判断用户类型
  if(userStore.roleId === 1){
    data.canOperate = false;
  } else {
    data.canOperate = true;
  }
  // 获取文件上传地址
  const res = await getFileUploadUrl();
  data.fileUploadUrl = res.data;
  getCourseList()
})
</script>

<template>
  <div class="course-page">
    <el-row>
      <el-col :span="8" v-for="course in data.courseList" :key="course.id">
        <!-- 课程卡片 -->
        <el-card body-style="padding:0px" class="course-card">
          <!-- 配图 -->
          <img src="@/assets/img/course.png" style="width: 100%"/>
          <div class="course-card-main">
            <span class="course-title">{{ course.name }}</span>
            <el-button type='primary' text>{{ course.student_num }}课时</el-button>
            <el-button type='primary' text @click="openClassNotificationModal(course.id)">班级通知</el-button>
            <el-button type='primary' text @click="openExperimentDetailModal(course.id)">进入课程</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <!-- 实验详情框 -->
  <el-dialog v-model="data.experimentDetailModalVisible" title="实验详情" class="experimentDetailModal" center>
    <!-- 章节列表 -->
    <div class="chapter-list">
      <el-table :data="data.subcourseList" stripe border style="width: 100%">
        <el-table-column prop="id" label="章节" width="60" />
        <el-table-column prop="name" label="名称" width="80" />
        <el-table-column prop="desc" label="描述" />
        <el-table-column label="进度" >
          <template v-slot="scope">
            <span>{{ scope.row.rate }}%</span>
          </template>
        </el-table-column>
        <!-- 右侧固定列 展示详情信息 -->
        <el-table-column fixed="right" label="操作" min-width="60">
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="openExperiment()">进入实验</el-button>
            <el-button v-if="userStore.roleId <= 1" link type="primary" size="small" @click="openStudyProgressModal(scope.row.id)">学习进度</el-button>
            <el-button link type="primary" size="small" @click="openStuReport(data.currentExperimentId, scope.row.id)">学习报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
  <!-- 班级通知框 -->
  <el-dialog v-model="data.classNotificationModalVisible" title="班级通知" width="600" center>
    <!-- 搜索框 -->
    <div class="notification-header">
      <el-input v-model="data.inputNotification" style="width: 240px" class="mr-3" placeholder="请输入通知标题" />
      <el-button type="primary" class="mr-3" @click="searchNotification(data.currentExperimentId)">搜索</el-button>
      <el-button v-if="data.canOperate" type="primary" class="mr-3" @click="openCreateNotificationModal(data.currentExperimentId)">创建新通知</el-button>
    </div>
    <!-- 通知列表 -->
    <div class="notification-list">
      <el-table :data="data.notificationList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="content" label="通知内容"/>
        <el-table-column prop="file" label="文件">
          <template v-slot="scope">
            <template v-for="(file, index) in scope.row.files_info">
              {{ file.name }} <br>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间" />
        <el-table-column v-if="data.canOperate" fixed="right" label="操作">
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="removeNotification(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
  <!-- 创建班级通知框 -->
  <el-dialog v-model="data.createNotificationModalVisible" title="创建班级通知" width="600" center>
    <div class="course-dialog">
      <el-form :model="data.newNotificationForm" class="w-[30rem]">
        <!-- 输入通知标题 -->
        <el-form-item>
          <el-input v-model="data.newNotificationForm.content" placeholder="请输入通知标题">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 文件列表 -->
        <el-form-item>
          <el-upload
            class="upload-demo"
            drag
            :action="data.fileUploadUrl"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :on-success="handleSuccess" 
            :before-upload="beforeUpload"
            :file-list="data.newNotificationForm.files_info"
            :limit="data.fileLimit"
            multiple
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              把文件拖拽到此处<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                上传单个文件大小不能超过 20MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitNotificationCreate()">创建新通知</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
  <!-- 学习进度框 -->
  <el-dialog v-model="data.studyProgressModalVisible" title="学习进度" class="experimentDetailModal" center>
    <!-- 学习进度列表 -->
    <div class="notification-list">
      <el-table :data="data.studyProgressList" border style="width: 100%">
        <el-table-column prop="subcourse_name" label="章节名" />
        <el-table-column v-if="userStore.roleId > 1" prop="user_id_number" label="学生学号"/>
        <el-table-column v-if="userStore.roleId > 1" prop="user_name" label="学生姓名"/>
        <el-table-column prop="learn_time" label="已学习时间" />
        <el-table-column prop="use_time" label="规定时间" />
        <el-table-column label="是否完成">
          <template v-slot="scope">
            <span v-if="scope.row.use_time <= scope.row.learn_time">是</span>
            <span v-if="scope.row.use_time > scope.row.learn_time">否</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 整体页面设置 */
.course-page {
  height: 100%;
  width: inherit;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-3 rounded-md;
}
.course-main {
  height: 100%;
  width: 100%;
}
.course-card {
  width: 300px;
  margin-top: 2rem;
  transition: all .2s;
}
.course-card:hover {
  transform: scale(1.05);
}
.course-card-main {
  text-align: center;
  @apply pb-1;
}
.course-title {
  display: block;
}
.notification-header {
  @apply mb-2;
}
/* 模态框 */
.course-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
