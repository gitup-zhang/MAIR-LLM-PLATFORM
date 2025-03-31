<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, UploadFilled } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/user';
import { getFileUploadUrl } from '@/apis/file';
import { getStuStudyProgessDetail, getTeacherStudyProgessDetail } from '@/apis/record';
import { getClassList, getCourseDetailInfo } from '@/apis/experiment';
import { getNotificationList, deleteNotification, createNotification } from '@/apis/notification';
import { getSubcourseContainerList, stopContainer, startContainer, deleteContainer, createContainer } from "@/apis/container";

const userStore = useUserStore();
const router = useRouter();
const data = reactive({
  // 展示信息
  userName: sessionStorage.name,
  userClassNumber: 0,
  fileUploadUrl: '',
  currentCourseId: 0,
  currentSubcourseId: 0,
  fileLimit: 1,
  // 是否可以操作
  canOperate: false,
  // 当前实验 ID
  currentExperimentId: -1,
  // 输入
  inputNotification: '',
  // 列表
  notificationList: [],
  courseList: [] as any,
  studyProgressList: [],
  subcourseList: [],
  containerList: [] as any,
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
  experimentContainerModalVisible: false,
  page: 1,
  count: 3,
  total: 0,
  experimentPage: 1,
  experimentCount: 6,
  experimentTotal: 0,
  containerPage: 1,
  containerCount: 6,
  containerTotal: 0
})

// 获取课程列表
const getCourseList = async () => {
  const res = await getClassList('study', data.page, data.count);
  data.userClassNumber = res.data.total;
  data.courseList = res.data.list;
  data.total = res.data.total;
}
// 分页
const handleSizeChange = (val: any) => {
  getCourseList();
}
const handleCurrentChange = (val: any) => {
  data.page = val;
  getCourseList();
}

// 获取课程详情
const getCourseDetail = async (courseId:number, page:number, count:number) => {
  const res = await getCourseDetailInfo(courseId, page, count);
  data.experimentTotal = res.data.total;
  data.subcourseList = res.data.list;
}
// 分页
const handleExperimentSizeChange = (val: any) => {
  getCourseDetail(data.currentCourseId, data.experimentPage, data.experimentCount);
}
const handleExperimentCurrentChange = (val: any) => {
  data.experimentPage = val;
  getCourseDetail(data.currentCourseId, data.experimentPage, data.experimentCount);
}
// 进入课程
const openExperimentDetailModal = (courseId: number) => {
  data.currentExperimentId = courseId;
  data.experimentDetailModalVisible = true;
  data.currentCourseId = courseId;
  getCourseDetail(courseId, data.experimentPage, data.experimentCount);
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
      type: 'error',
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
  router.push({
    path: "/experimentIndex",
  })
  data.experimentDetailModalVisible = false
  // const baseUrl = window.location.origin;
  // const baseUrl = window.location.origin + window.location.pathname;
  // // 拼接目标页面的路径
  // const targetUrl = `${baseUrl}/experimentIndex`;
  // // 在新窗口打开目标页面
  // window.open(targetUrl, '_blank');
  
  // window.open('http://8.155.19.142:30048/lab?')
}

// 下载文件
const downloadFile = (fileUrl: string) => {
  console.log(fileUrl)
  window.open(fileUrl);
}

// 检索容器
const searchExperimentContainer = async () => {
  const res = await getSubcourseContainerList(data.currentSubcourseId, data.currentExperimentId, data.containerPage, data.containerCount);
  data.containerList = res.data ? res.data : [];
  data.containerTotal = res.data.total ? res.data.total : 0;
}
// 查看容器
const openExperimentContainerModal = async (subcourseId: number) => {
  data.experimentContainerModalVisible = true;
  data.currentSubcourseId = subcourseId;
  searchExperimentContainer();
}

// 创建容器
const createNewContainer = async (subcourseId: number) => {
  const res = await createContainer(userStore.id, subcourseId, data.currentExperimentId);
  if(res.status !== 0){
    ElMessage({
    message: res.message,
    type: 'warning',
    plain: true,
  })
  }
}

// 停止容器
const ceaseContainer = async (id: number) => {
  const res = await stopContainer(id);
  if(res.status === 0){
    ElMessage({
      message: '已停止该容器',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '该容器无法停止',
      type: 'error',
      plain: true,
    })
  }
  searchExperimentContainer();
}
// 启动容器
const launchContainer = async (id: number) => {
  const res = await startContainer(id);
  if(res.status === 0){
    ElMessage({
      message: '容器启动成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '容器启动失败',
      type: 'error',
      plain: true,
    })
  }
  searchExperimentContainer();
}
// 删除容器
const removeContainer = async (id: number) => {
  const res = await deleteContainer(id);
  if(res.status === 0){
    ElMessage({
      message: '容器删除成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '容器删除失败',
      type: 'error',
      plain: true,
    })
  }
  searchExperimentContainer();
}
// 进入容器
const enterContainer = async (address: string) => {
  window.open(address)
}
// 容器分页
const containerSizeChange = (val: any) => {
  searchExperimentContainer();
}
const containerCurrentChange = (val: any) => {
  data.containerPage = val;
  searchExperimentContainer();
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
  <div class="experiment-page">
    <!-- 顶部用户信息区域 -->
    <el-row class="experiment-info-container">
      <el-col :span="16" class="user-info">
        <!-- 头像照片 -->
        <el-avatar :size="100" class="mr-5" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <div>
          <div class="text-2xl italic font-semibold text-light-50">欢迎 {{ data.userName }} 进入实验页面！</div>
          <div class="text-xl italic font-semibold text-light-50 mt-1">您正在学习 {{ data.userClassNumber }} 门课程！</div>
        </div>
      </el-col>
    </el-row>
    <!-- 左侧实验列表 -->
    <div class="experiment-list">
      <el-row class="experiment-list-container" :gutter="12">
        <el-empty v-if="data.courseList.length === 0" description="暂无课程实验信息" />
        <template v-if="data.courseList.length !== 0">
          <el-col :span="8" v-for="course in data.courseList" :key="course.id">
            <el-card :body-style="{ padding: '10px', margin: '5px' }">
              <img src="@/assets/img/course.png" style="width: 100%" />
              <div class="course-card-main">
                <span class="course-title">班级名称：{{ course.name }}</span>
                <span class="course-title">课程名称：{{ course.course_name }}</span>
                <span class="course-title">上课地点：{{ course.college_name }}</span>
              </div>
              <div class="course-card-btn">
                <el-button type='primary'>{{ course.student_num }}课时</el-button>
                <el-button type='primary' @click="openClassNotificationModal(course.id)">班级通知</el-button>
                <el-button type='primary' @click="openExperimentDetailModal(course.id)">进入课程</el-button>
                <el-button type='primary' @click="openExperimentContainerModal(course.id)">查看容器</el-button>
              </div>
            </el-card>
          </el-col>
        </template>

      </el-row>
      <!-- 分页 -->
      <el-pagination v-if="data.courseList.length !== 0" background layout="prev, pager, next" :total="data.total"
        :page-size="data.count" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        class="mt-4 mx-auto" />
    </div>
  </div>

  <!-- 实验详情框 -->
  <el-dialog v-model="data.experimentDetailModalVisible" title="实验详情" width="1200" center>
    <!-- 章节列表 -->
    <div class="experiment-dialog">
      <el-empty v-if="data.subcourseList.length === 0" description="暂无章节信息" />
      <el-table v-else :data="data.subcourseList" stripe border style="width: 100%" max-height="400">
        <el-table-column prop="name" label="名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="desc" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="实验说明" min-width="200" show-overflow-tooltip>
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="downloadFile(scope.row.files_info[0].url)">
              {{ scope.row.files_info[0].name }}
            </el-button>
          </template>
        </el-table-column>
        <!-- 右侧固定列 展示详情信息 -->
        <el-table-column fixed="right" label="操作" min-width="200" show-overflow-tooltip>
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="openExperiment()">进入实验</el-button>
            <el-button v-if="userStore.roleId <= 1" link type="primary" size="small"
              @click="openStudyProgressModal(scope.row.id)">学习进度</el-button>
            <el-button link type="primary" size="small"
              @click="openStuReport(data.currentExperimentId, scope.row.subcourse_id)">学习报告</el-button>
            <el-button link type="primary" size="small"
              @click="createNewContainer(scope.row.subcourse_id)">创建容器</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination v-if="data.subcourseList.length !== 0" background layout="prev, pager, next"
        :total="data.experimentTotal" :page-size="data.experimentCount" @size-change="handleExperimentSizeChange"
        @current-change="handleExperimentCurrentChange" class="mt-4 mx-auto" />
    </div>
  </el-dialog>

  <!-- 班级通知框 -->
  <el-dialog v-model="data.classNotificationModalVisible" title="班级通知" width="1200" center>
    <div class="experiment-dialog">
      <!-- 搜索框 -->
      <div class="dialog-search-box">
        <div class="search-title">班级通知</div>
        <el-input v-model="data.inputNotification" style="width: 240px" class="mr-3" placeholder="请输入通知标题" />
        <el-button type="primary" class="mr-3" @click="searchNotification(data.currentExperimentId)">搜索</el-button>
        <el-button v-if="data.canOperate" type="primary" class="mr-3"
          @click="openCreateNotificationModal()">创建新通知</el-button>
      </div>
      <!-- 通知列表 -->
      <div class="notification-list">
        <el-empty v-if="data.notificationList.length === 0" description="暂无通知" />
        <el-table v-else :data="data.notificationList" border style="width: 100%" max-height="400">
          <el-table-column prop="content" label="通知内容" show-overflow-tooltip min-width="200" />
          <el-table-column prop="file" label="文件" show-overflow-tooltip min-width="200">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="downloadFile(scope.row.files_info[0].url)">
                {{ scope.row.files_info[0].name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="发布时间" show-overflow-tooltip min-width="200" />
          <el-table-column v-if="data.canOperate" fixed="right" label="操作" show-overflow-tooltip min-width="200">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="removeNotification(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>

  <!-- 创建班级通知框 -->
  <el-dialog v-model="data.createNotificationModalVisible" title="创建班级通知" width="600" center>
    <div class="experiment-dialog">
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
          <el-upload class="upload-demo" drag :action="data.fileUploadUrl" :on-remove="handleRemove"
            :before-remove="beforeRemove" :on-exceed="handleExceed" :on-success="handleSuccess"
            :before-upload="beforeUpload" :file-list="data.newNotificationForm.files_info" :limit="data.fileLimit"
            multiple>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              把文件拖拽到此处<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">上传单个文件大小不能超过 20MB</div>
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
  <el-dialog v-model="data.studyProgressModalVisible" title="学习进度" width="1200" center>
    <!-- 学习进度列表 -->
    <div class="notification-list">
      <el-empty v-if="data.studyProgressList.length === 0" description="暂无学习进度情况" />
      <el-table v-else :data="data.studyProgressList" border style="width: 100%">
        <el-table-column prop="subcourse_name" label="章节名" />
        <el-table-column v-if="userStore.roleId > 1" prop="user_id_number" label="学生学号" />
        <el-table-column v-if="userStore.roleId > 1" prop="user_name" label="学生姓名" />
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

  <!-- 查看容器 -->
  <el-dialog v-model="data.experimentContainerModalVisible" title="查看容器" width="1200" center>
    <!-- 所有容器信息展示 -->
    <div class="experiment-dialog">
      <el-empty v-if="data.containerList.length === 0" description="暂无容器信息" />
      <el-table v-if="data.containerList.length !== 0" :data="data.containerList" border style="width: 100%"
        max-height="400">
        <el-table-column prop="image_name" label="名称" min-width="200" />
        <el-table-column prop="user_id_number" label="ID" min-width="200" />
        <el-table-column prop="user_name" label="用户" min-width="200" />
        <el-table-column prop="class_name" label="班级" min-width="200" />
        <el-table-column prop="subcourse_name" label="章节" min-width="200" />
        <el-table-column prop="status" label="状态" min-width="200" />
        <el-table-column fixed="right" label="操作" min-width="300">
          <template v-slot="scope">
            <el-button v-if="scope.row.status != 'delete' && scope.row.status != 3" link type="primary" size="small"
              @click="enterContainer(scope.row.addr)">进入容器</el-button>
            <el-button v-if="scope.row.status != 'delete' && scope.row.status != 3" link type="primary" size="small"
              @click="ceaseContainer(scope.row.container_id)">停止容器</el-button>
            <el-button v-if="scope.row.status != 'delete' && scope.row.status == 3" link type="primary" size="small"
              @click="launchContainer(scope.row.container_id)">启动容器</el-button>
            <el-button v-if="scope.row.status != 'delete'" link type="primary" size="small"
              @click="removeContainer(scope.row.container_id)">删除容器</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination 
        v-if="data.containerList.length !== 0" 
        background layout="prev, pager, next"
        :total="data.containerTotal" 
        :page-size="data.containerCount" 
        @size-change="containerSizeChange"
        @current-change="containerCurrentChange" 
        class="mt-4 mx-auto"
      />
    </div>
  </el-dialog>
</template>

<style scoped>
/* 整体页面设置 */
.experiment-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.experiment-info-container {
  width: 100%;
  height: 20%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}
.user-info {
  width: 100%;
  height: 100%;
  @apply flex flex-row items-center p-6;
}
.user-info-box {
  width: 80%;
  height: 80%;
  background-color: rgba(0, 0, 0, 0.1);
  @apply flex flex-row items-center p-6;
}
.experiment-list {
  width: 100%;
  height: 80%;
  @apply pr-1 pt-1 pb-1 flex flex-col justify-center;
}
.experiment-img {
  border: #a1c4fd 1px solid;
  border-radius: 10px;
  box-sizing: border-box;
}
.experiment-list-container {
  width: 100%;
  @apply pt-1 pl-1 flex flex-row justify-center;
}
/* 卡片样式 */
.class-card {
  width: 90%;
  height: 400px;
  margin-top: 2rem;
  border-radius: 10px;
  overflow: hidden;
  border: #d1d5db solid 1px;
  transition: all .2s;
}
.class-card:hover {
  transform: scale(1.01);
}
.course-card-main {
  @apply p-3 text-sky-500;
}
.course-card-btn {
  @apply p-1 flex flex-row justify-center;
}
.course-title {
  display: block;
  @apply mt-1;
}
/* 模态框 */
.experiment-dialog {
  @apply flex items-center justify-center flex-col;
}
.dialog-search-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md;
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
.notification-list {
  width: 100%;
  @apply flex flex-col mt-4;
}
</style>
