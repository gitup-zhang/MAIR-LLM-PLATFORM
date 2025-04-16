<script setup lang="ts">
// 教师课程页
import { onMounted, reactive } from "vue"
import { ElMessage } from 'element-plus';
import { Document, Edit, Filter, UploadFilled } from '@element-plus/icons-vue'
import { getCourseDetailInfo } from '@/apis/experiment'
import { getCourseList, getCourseApplyRecord, deleteCourseApply } from '@/apis/course'
import { getClassList, getManagedClassList, getTeachedClassList, passClassApply, refuseClassApply } from '@/apis/class'
import { getImageInfo, deleteImage, createImage, buildImage } from '@/apis/image'
import { getNotificationList, deleteNotification, createNotification } from '@/apis/notification';
import { getTeacherStudyProgessDetail } from '@/apis/record';
import { getSubcourseContainerList, stopContainer, startContainer, deleteContainer } from '@/apis/container';
import { useUserStore } from '@/stores/user'
import { useRouter } from "vue-router"

const userStore = useUserStore();
const router = useRouter();

const data = reactive({
  activeName: 'first',
  fileUploadUrl: 'http://8.155.19.142:30027/olexp_server/file/',
  inputContainer:'',
  fileLimit: 1,
  inputImage: '',
  inputNotification: '',
  searchText: '',
  searchManageClassText: '',
  currentExperimentId: -1,
  currentSubcourseId: -1,
  // 全部班级信息
  courseList: [],
  experimentList: [],
  teachExperimentList: [] as any,
  imageList: [] as any,
  // 课程内部的详细列表
  subcourseList: [],
  // 当前选中的班级信息
  currentCourseDetail: [] as any,
  // 已报名班级信息
  enrolledClassList: [],
  // 管理的班级列表
  managedClassList: [],
  // 班级申请记录
  courseApplyList: [],
  notificationList: [],
  studyProgressList: [],
  containerList: [],
  managedContainerList: [] as any,
  // 新表单
  newImageForm: {
    image_id: 0 || '',
    desc: '',
    container_id: '',
    name: ''
  },
  newNotificationForm: {
    content: '',
    class_id: -1,
    files_info: [] as any
  },
  // 容器地址
  containerAddr: '',
  // 分页相关
  classPage: 1,
  classCount: 6,
  classTotal: 0,
  applyPage: 1,
  applyCount: 6,
  applyTotal: 0,
  enrolledClassPage: 1,
  enrolledClassCount: 6,
  enrolledClassTotal: 0,
  managedClassPage: 1,
  managedClassCount: 6,
  managedClassTotal: 0,
  imagePage: 1,
  imageCount: 6,
  imageTotal: 0,
  studyProgressPage: 1,
  studyProgressCount: 6,
  studyProgressTotal: 0,
  containerPage: 1,
  containerCount: 6,
  containerTotal: 0,
  teachExperimentPage: 1,
  teachExperimentCount: 3,
  teachExperimentTotal: 0,
  page: 1,
  count: 6,
  total: 0,
  courseDetailVisible: false,
  courseApplyDetailVisible: false,
  classNotificationModalVisible: false,
  experimentDetailVisible: false,
  createImageModalVisible: false,
  modifyImageModalVisible: false,
  createNotificationModalVisible: false,
  classProgressModalVisible: false,
  checkContainerModalVisible: false,
  containerListLoading: true,
  searchCourseLoading: false,
  searchManagedClassLoading: false,
  teachExperimentListLoading: true,
  searchImageLoading: false,
  submitNotificationCreateLoading: false,
  classProgressLoading: false,
  courseApplyDetailLoading: false,
  searchNotificationLoading: false,
})

// 搜索班级
const searchCourse = async () => {
  data.searchCourseLoading = true;
  if(data.searchText.length > 0){
    data.classPage = 1;
  }
  const res = await getCourseList(data.searchText, data.classPage, data.classCount);
  data.courseList = res.data.list;
  data.classTotal = res.data.total;
  data.searchCourseLoading = false;
}
// 班级分页
const classSizeChange = (val: any) => {
  searchCourse();
}
const classCurrentChange = (val: any) => {
  data.classPage = val;
  searchCourse();
}
// 查看课程详情
const getCourseDetail = (courseDetail: any) => {
  data.courseDetailVisible = true;
  data.currentCourseDetail = courseDetail;
}

// 查看课程申请记录
const getCourseApplyDetail = async () => {
  data.courseApplyDetailLoading = true;
  data.courseApplyDetailVisible = true;
  const res = await getCourseApplyRecord(sessionStorage.userId, data.applyPage, data.applyCount);
  data.courseApplyList = res.data.list;
  data.applyTotal = res.data.total;
  data.courseApplyDetailLoading = false;
}
// 通过班级申请
const passClassApplication = async (id: number) => {
  const res = await passClassApply(id);
  if(res.status === 0){
    ElMessage({
      message: '班级申请已通过',
      type: 'success',
      plain: true,
    })
  }else {
    ElMessage({
      message: '班级申请通过失败',
      type: 'success',
      plain: true,
    })
  }
  getCourseApplyDetail()
}
// 拒绝班级申请
const refuseClassApplication = async (id: number) => {
  const res = await refuseClassApply(id);
  if(res.status === 0){
    ElMessage({
      message: '班级申请拒绝成功',
      type: 'success',
      plain: true,
    })
  }else {
    ElMessage({
      message: '班级申请拒绝失败',
      type: 'success',
      plain: true,
    })
  }
  getCourseApplyDetail()
}
// 取消申请
const removeCourseApply = async (applyId:number) => {
  const res = await deleteCourseApply(applyId);
  if(res.status === 0){
    ElMessage({
      message: '班级申请取消成功',
      type: 'success',
      plain: true,
    })
  }else {
    ElMessage({
      message: '班级申请取消失败',
      type: 'success',
      plain: true,
    })
  }
  getCourseApplyDetail()
}

// 搜索已报名的班级信息
const searchEnrolledClass = async () => {
  const res = await getClassList(data.enrolledClassPage, data.enrolledClassCount);
  data.enrolledClassList = res.data.list;
  data.enrolledClassTotal = res.data.total;
}
// 已报名的班级分页
const enrolledClassSizeChange = (val: any) => {
  searchEnrolledClass();
}
const enrolledClassCurrentChange = (val: any) => {
  data.enrolledClassPage = val;
  searchEnrolledClass();
}
// 获取考试安排信息
const checkExamArrangement = (id: number) => {
  router.push({
    path: "/examArrange",
    query: {
      id: id
    }
  })
}

// 搜索管理的班级
const searchManagedClass = async () => {
  data.searchManagedClassLoading = true;
  if(data.searchManageClassText.length > 0){
    data.managedClassPage = 1;
  }
  const res = await getManagedClassList(data.searchManageClassText, data.managedClassPage, data.managedClassCount);
  data.managedClassList = res.data.list;
  data.managedClassTotal = res.data.total;
  data.searchManagedClassLoading = false;
}
// 班级分页
const managedClassSizeChange = (val: any) => {
  searchManagedClass();
}
const managedClassCurrentChange = (val: any) => {
  data.managedClassPage = val;
  searchManagedClass();
}

// 搜索镜像
const searchImage = async () => {
  data.searchImageLoading = true;
  const res = await getImageInfo(data.imagePage, data.imageCount);
  data.imageList = res.data.normal_image_list;
  data.imageTotal = res.data.total;
  data.searchImageLoading = false;
}
// 获取镜像相关信息
const getImageData = async () => {
  var tmp = {} as any;
  if (sessionStorage.image_id === '-1') {
    const res = await getImageInfo(data.imagePage, data.imageCount);
    data.imageList = res.data.normal_image_list;
    data.newImageForm.image_id = data.imageList[0]['id'];
  } else if (sessionStorage.image_name !== sessionStorage.flag_name) {
    tmp = {}
    tmp['name'] = sessionStorage.image_name;
    tmp['id'] = sessionStorage.image_id;
    data.imageList.push(tmp);
    data.newImageForm.desc = sessionStorage.desc;
    data.newImageForm.container_id = 'modify';
    data.newImageForm.image_id = 'modify';
    data.newImageForm.name = sessionStorage.flag_name;
    data.containerAddr = 'modify';
  }
  data.newImageForm.image_id = data.imageList[0]['id'];
}
// 添加镜像
const addImage = (index: number) => {
  if(index === -1){
    sessionStorage.image_id = index;
  } else {
    sessionStorage.image_id = data.imageList[index]['id'];
    sessionStorage.image_name = data.imageList[index]['name'];
  }
  getImageData();
  // 打开创建镜像模态框
  data.createImageModalVisible = true;
}
// 修改镜像
const updateImage = (index: number) => {
  sessionStorage.desc = data.imageList[index]['desc'];
  sessionStorage.flag_name = data.imageList[index]['name'];
  if(index === -1){
    sessionStorage.image_id = index;
  } else {
    sessionStorage.image_id = data.imageList[index]['id'];
    sessionStorage.image_name = data.imageList[index]['name']
  }
  data.modifyImageModalVisible = true;
}
// 删除镜像
const removeImage = async (index: number) => {
  const res = await deleteImage(data.imageList[index]['id'] as number, data.imageList[index]['image_tag'] as string);
  if(res.status === 0){
    ElMessage({
      message: '镜像删除成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '镜像删除失败',
      type: 'error',
      plain: true,
    })
  }
  searchImage();
}
// 创建镜像
const submitImageCreate = async () => {
  const res = await createImage(data.newImageForm.image_id);
  if(res.status === 0){
    ElMessage({
      message: '镜像创建成功',
      type: 'success',
      plain: true,
    })
    data.newImageForm.container_id = res.data.container_id
    data.containerAddr = res.data.addr
    window.open(data.containerAddr)
  } else {
    ElMessage({
      message: '镜像创建失败',
      type: 'error',
      plain: true,
    })
  }
}
// 保存镜像
const saveImageCreate = async () => {
  if(data.containerAddr === ''){
    ElMessage({
      message: '请设置镜像',
      type: 'warning',
      plain: true,
    })
  } else {
    const res = await buildImage(data.newImageForm.container_id, data.newImageForm.desc, data.newImageForm.name, data.newImageForm.image_id);
    if(res.status === 0){
      ElMessage({
        message: '镜像创建成功',
        type: 'success',
        plain: true,
      })
      data.createImageModalVisible = false;
    } else {
      ElMessage({
        message: '镜像创建失败',
        type: 'error',
        plain: true,
      })
    }
  }
}
// 镜像分页
const imageSizeChange = (val: any) => {
  searchImage();
}
const imageCurrentChange = (val: any) => {
  data.imagePage = val;
  searchImage();
}

// 搜索授课实验信息
const searchTeachedExperiment = async () => {
  const res = await getTeachedClassList(data.teachExperimentPage, data.teachExperimentCount);
  data.teachExperimentList = res.data.list;
  data.teachExperimentTotal = res.data.total;
  data.teachExperimentListLoading = false;
}
// 搜索班级通知
const searchNotification = async (classId: number) => {
  data.searchNotificationLoading = true;
  const res = await getNotificationList(classId, data.inputNotification, data.page, data.count);
  data.notificationList = res.data.list;
  data.total = res.data.total;
  data.searchNotificationLoading = false;
}
// 获取班级通知
const openClassNotificationModal = (id: number) => {
  data.classNotificationModalVisible = true;
  data.currentExperimentId = id;
  searchNotification(id);
}
// 打开创建通知模态框
const openCreateNotificationModal = () => {
  data.createNotificationModalVisible = true;
  data.newNotificationForm.class_id = data.currentExperimentId;
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
  data.submitNotificationCreateLoading = true;
  const res = await createNotification(data.newNotificationForm);
  console.log(res);
  if(res.status === 0){
    ElMessage({
      message: '消息创建成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '消息创建失败',
      type: 'error',
      plain: true,
    })
  }
  data.submitNotificationCreateLoading = false;
  searchNotification(data.currentExperimentId);
} 

// 进入学生课程报告页面
const openStuReport = (courseId: number, subcourseId: number) => {
  data.experimentDetailVisible = false
  router.push({
    path: "/teacherReport",
    query: {
      courseId: courseId, 
      subcourseId: subcourseId
    }
  })
}
// 获取课程详情
const getExperimentDetail = async (courseId:number, page:number, count:number) => {
  const res = await getCourseDetailInfo(courseId, page, count);
  data.subcourseList = res.data.list;
  data.total = res.data.total;
}
// 课程分页
const handleSizeChange = (val: any) => {
  getExperimentDetail(data.currentExperimentId, data.page, data.count);
}
const handleCurrentChange = (val: any) => {
  data.page = val;
  getExperimentDetail(data.currentExperimentId, data.page, data.count);
}
// 进入课程
const openExperimentDetailModal = (courseId: number) => {
  data.currentExperimentId = courseId;
  data.experimentDetailVisible = true;
  getExperimentDetail(courseId, data.page, data.count);
}
// 进入实验
const openExperiment = () => {
  data.experimentDetailVisible = false;
  window.open('http://8.155.19.142:30048/lab?');
}
// 查看学生学习进度
const openClassProgressModal = async (subcouseId: number) => {
  data.classProgressLoading = true;
  data.classProgressModalVisible = true;
  data.currentSubcourseId = subcouseId;
  const res = await getTeacherStudyProgessDetail(subcouseId, data.currentExperimentId, data.studyProgressPage, data.studyProgressCount);
  data.studyProgressList = res.data.list;
  data.studyProgressTotal = res.data.total;
  
  data.classProgressLoading = false;
}
// 查看容器
const openClassContainerModal = async (subcouseId: number) => {
  data.currentSubcourseId = subcouseId;
  data.checkContainerModalVisible = true;
  const res = await getSubcourseContainerList(subcouseId, data.currentExperimentId, data.containerPage, data.containerCount);
  data.containerList = res.data.list;
  data.containerTotal = res.data.total;
  data.containerListLoading = false;
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
  openClassContainerModal(data.currentSubcourseId);
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
  openClassContainerModal(data.currentSubcourseId);
}
// 删除容器
const removeContainer = async (id: number) => {
  const res = await deleteContainer(id);
  console.log('res:', res, id);
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
  openClassContainerModal(data.currentSubcourseId);
}
// 进入容器
const enterContainer = async (address: string) => {
  window.open(address)
}
// 学生学习进度分页
const studyProgressSizeChange = (val: any) => {
  openClassProgressModal(data.currentSubcourseId);
}
const studyProgressCurrentChange = (val: any) => {
  data.studyProgressPage = val;
  openClassProgressModal(data.currentSubcourseId);
}
// 容器分页
const containerSizeChange = (val: any) => {
  openClassContainerModal(data.currentSubcourseId);
}
const containerCurrentChange = (val: any) => {
  data.containerPage = val;
  openClassContainerModal(data.currentSubcourseId);
}
// 授课实验分页
const teachExperimentSizeChange = (val: any) => {
  searchTeachedExperiment();
}
const teachExperimentCurrentChange = (val: any) => {
  data.teachExperimentPage = val;
  searchTeachedExperiment();
}
// 下载文件
const downloadFile = (fileUrl: string) => {
  window.open(fileUrl);
}

// 搜索容器
// const searchManagedContainer = async () => {
//   const res = await getTeacherContainerList(data.inputContainer, data.containerPage, data.containerCount);
//   data.managedContainerList = res.data.list;
//   data.containerTotal = res.data.total;
// }

onMounted(() => {
  // 初始化
  searchCourse();
  searchEnrolledClass();
  searchManagedClass();
  searchTeachedExperiment();
  searchImage();
})
</script>

<template>
  <div class="class-page">
    <el-tabs v-model="data.activeName" type="border-card" class="experiment-tabs">
      <!-- 班级信息 -->
      <el-tab-pane label="班级信息" name="first" class="experiment-pane">
        <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
        <div class="course-main">
          <!-- 课程搜索框 -->
          <div class="select-course">
            <!-- 搜索 -->
            <el-input v-model="data.searchText" style="width: 240px" class="mr-3" placeholder="请输入班级名称" />
            <el-button type="primary" class="mr-3" @click="searchCourse()" :loading="data.searchCourseLoading">搜索</el-button>
            <el-button type="primary" class="ml-3" @click="getCourseApplyDetail()">班级申请记录</el-button>
          </div>
          <!-- 所有班级列表展示 -->
          <div class="course-list">
            <el-empty v-if="data.courseList.length === 0" description="暂无班级信息"/>
            <el-table v-if="data.courseList.length !== 0" :data="data.courseList" border style="width: 100%" max-height="400">
              <el-table-column prop="name" label="班级名" min-width="200" show-overflow-tooltip/>
              <el-table-column prop="course_name" label="课程名" min-width="200" show-overflow-tooltip/>
              <el-table-column prop="teacher_name" label="教师名" min-width="200" show-overflow-tooltip/>
              <el-table-column prop="capacity" label="学生数量" min-width="200" show-overflow-tooltip/>
              <el-table-column prop="end_time" label="截止时间" min-width="200" show-overflow-tooltip/>
              <el-table-column prop="college_name" label="教学单位名" min-width="200" show-overflow-tooltip/>
              <el-table-column prop="not_apply_reason" label="申请状态" min-width="200" show-overflow-tooltip/>
              <!-- 右侧固定列 展示详情信息 -->
              <el-table-column fixed="right" label="操作" min-width="60">
                <template v-slot="scope">
                  <el-button link type="primary" size="small" @click="getCourseDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              v-if="data.courseList.length !== 0"
              background 
              layout="prev, pager, next"
              :total="data.classTotal" 
              :page-size="data.classCount"
              @size-change="classSizeChange"
              @current-change="classCurrentChange"
              class="mt-4 mx-auto"
            />
          </div>
        </div>
      </el-tab-pane>
      <!-- 已报名班级 -->
      <el-tab-pane label="已报名班级" name="second" class="experiment-pane">
        <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
        <div class="course-list">
          <el-empty v-if="data.enrolledClassList.length === 0" description="暂无已报名班级信息"/>
          <el-table v-if="data.enrolledClassList.length !== 0" :data="data.enrolledClassList" border style="width: 100%" max-height="400">
            <el-table-column prop="name" label="班级名" min-width="200" show-overflow-tooltip/>
            <el-table-column prop="course_name" label="课程名" min-width="200" show-overflow-tooltip/>
            <el-table-column prop="teacher_name" label="教师名" min-width="200" show-overflow-tooltip/>
            <el-table-column prop="capacity" label="学生数量" min-width="200" show-overflow-tooltip/>
            <el-table-column prop="end_time" label="截止时间" min-width="200" show-overflow-tooltip/>
            <el-table-column prop="college_name" label="教学单位名" min-width="200" show-overflow-tooltip/>
            <el-table-column prop="not_apply_reason" label="申请状态" min-width="200" show-overflow-tooltip/>
            <!-- 右侧固定列 展示详情信息 -->
            <el-table-column fixed="right" label="操作" min-width="200">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="getCourseDetail(scope.row)">详情</el-button>
                <el-button link type="primary" size="small" @click="checkExamArrangement(scope.row.id)">考试安排</el-button>  
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-if="data.enrolledClassList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.enrolledClassTotal" 
            :page-size="data.enrolledClassCount"
            @size-change="enrolledClassSizeChange"
            @current-change="enrolledClassCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>
      <!-- 管理的班级 -->
      <el-tab-pane label="管理的班级" name="third" class="experiment-pane">
        <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
        <div v-if="data.managedClassList.length != 0" class="select-course mt-3">
          <!-- 搜索 -->
          <el-input v-model="data.searchManageClassText" style="width: 240px" class="mr-3" placeholder="请输入班级名称" />
          <el-button type="primary" class="mr-3" @click="searchManagedClass()" :loading="data.searchManagedClassLoading">搜索</el-button>
        </div>
        <div class="course-list">
          <el-empty v-if="data.managedClassList.length === 0" description="暂无管理的班级信息"/>
          <el-table v-if="data.managedClassList.length !== 0" :data="data.managedClassList" border style="width: 100%" max-height="400">
            <el-table-column prop="name" label="班级名" min-width="200" show-overflow-tooltip/>
            <el-table-column prop="course_name" label="课程名" min-width="200" show-overflow-tooltip/>
            <el-table-column label="学生量" min-width="200" show-overflow-tooltip>
              <template v-slot="scope">
                {{scope.row.student_num}} / {{ scope.row.capacity }}
              </template>
            </el-table-column>
            <el-table-column label="启止时间" min-width="200" show-overflow-tooltip>
              <template v-slot="scope">
                {{ scope.row.start_time + ' -- ' + scope.row.end_time }}
              </template>
            </el-table-column>
            <el-table-column prop="college_name" label="教学单位名" min-width="200" show-overflow-tooltip/>
            <el-table-column prop="not_apply_reason" label="申请状态" min-width="200" show-overflow-tooltip/>
            <!-- 右侧固定列 展示详情信息 -->
            <el-table-column fixed="right" label="操作" min-width="200" show-overflow-tooltip>
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="getCourseDetail(scope.row)">详情</el-button>
                <el-button link type="primary" size="small" @click="checkExamArrangement(scope.row.id)">考试安排</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination 
            v-if="data.managedClassList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.managedClassTotal" 
            :page-size="data.managedClassCount"
            @size-change="managedClassSizeChange"
            @current-change="managedClassCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="授课实验" name="fifth" class="experiment-pane">
        <div class="experiment_area" v-loading="data.teachExperimentListLoading">
        <el-empty v-if="data.teachExperimentList.length === 0 && !data.teachExperimentListLoading" description="暂无授课实验信息"/>
        <el-row class="experiment-list-container" gutter="12">
          <el-col v-if="data.teachExperimentList.length !== 0" :span="8" v-for="experiment in data.teachExperimentList" :key="experiment.id">
            <!-- 课程卡片 -->
            <el-card>
              <!-- 配图 -->
              <img src="@/assets/img/course.png" style="width: 100%"/>
              <div class="experiment-card-main">
                <span class="experiment-title">班级名称：{{ experiment.name }}</span>
                <span class="experiment-title">课程名称：{{ experiment.course_name }}</span>
                <span class="experiment-title">上课地点：{{ experiment.college_name }}</span>
                <span class="experiment-title">课时：{{ experiment.student_num }}</span>
                <div class="experiment-card-btn">
                  <el-button type='primary' @click="openClassNotificationModal(experiment.id)">班级通知</el-button>
                  <el-button type='primary' @click="openExperimentDetailModal(experiment.id)">进入课程</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-pagination
            v-if="data.teachExperimentList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.teachExperimentTotal" 
            :page-size="data.teachExperimentCount"
            @size-change="teachExperimentSizeChange"
            @current-change="teachExperimentCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>

      </el-tab-pane>
      <!-- 镜像管理 -->
      <el-tab-pane label="镜像管理" name="sixth" class="experiment-pane">
        <div class="search-box">
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputImage" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入镜像名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchImage()" :loading="data.searchImageLoading">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="addImage(-1)">创建新镜像</el-button>
          </div>
        </div>
        <!-- 所有镜像信息展示 -->
        <div class="course-list">
          <el-empty v-if="data.imageList.length === 0" description="暂无镜像信息"/>
          <el-table v-if="data.imageList.length !== 0" :data="data.imageList" border style="width: 100%">
            <el-table-column prop="name" label="镜像名"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="addImage(scope.$index)">添加镜像</el-button>
                <el-button v-if="scope.row.is_used == 0" link type="primary" size="small" @click="updateImage(scope.$index)">修改镜像</el-button>
                <el-button v-if="scope.row.is_used == 0" link type="primary" size="small" @click="removeImage(scope.$index)">删除镜像</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-if="data.imageList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.imageTotal" 
            :page-size="data.imageCount"
            @size-change="imageSizeChange"
            @current-change="imageCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="容器管理" name="seventh" class="experiment-pane">
        <div class="search-box">
          <div class="search-title">容器管理</div>
          <div class="select-exam">
            <el-input v-model="data.inputContainer" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入容器名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchManagedContainer()">搜索</el-button>
          </div>
        </div>
        <div class="show-list">
          <el-empty v-if="data.managedContainerList.length === 0" description="暂无容器信息"/>
          <el-table v-if="data.managedContainerList.length !== 0" :data="data.containerList" border style="width: 100%" max-height="400">
            <el-table-column prop="image_name" label="名称" min-width="200"/>
            <el-table-column prop="user_id_number" label="ID" min-width="200"/>
            <el-table-column prop="user_name" label="用户" min-width="200"/>
            <el-table-column prop="class_name" label="班级" min-width="200"/>
            <el-table-column prop="subcourse_name" label="章节" min-width="200"/>
            <el-table-column prop="status" label="状态" min-width="200"/>
            <el-table-column fixed="right" label="操作" min-width="300">
              <template v-slot="scope">
                <el-button v-if="scope.row.status != 'delete' && scope.row.status != 3" link type="primary" size="small" @click="enterContainer(scope.row.addr)">进入容器</el-button>
                <el-button v-if="scope.row.status != 'delete' && scope.row.status != 3" link type="primary" size="small" @click="ceaseContainer(scope.row.container_id)">停止容器</el-button>
                <el-button v-if="scope.row.status != 'delete' && scope.row.status == 3" link type="primary" size="small" @click="launchContainer(scope.row.container_id)">启动容器</el-button>
                <el-button v-if="scope.row.status != 'delete'" link type="primary" size="small" @click="removeContainer(scope.row.container_id)">删除容器</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination 
            v-if="data.containerList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.containerTotal" 
            :page-size="data.containerCount"
            @size-change="containerSizeChange"
            @current-change="containerCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>

  <!-- 班级详情模态框 -->
  <el-dialog v-model="data.courseDetailVisible" title="班级详细信息" width="600">
    <div class="experiment-dialog">
      <el-descriptions
        direction="vertical"
        :column="4"
        border
        class="class-description"
      >
        <el-descriptions-item label="班级名" :span="2">{{ data.currentCourseDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="教师名" :span="2">{{ data.currentCourseDetail.teacher_name }}</el-descriptions-item>
        <el-descriptions-item label="课程名" :span="2">{{ data.currentCourseDetail.course_name }}</el-descriptions-item>
        <el-descriptions-item label="容量" :span="2">{{ data.currentCourseDetail.capacity }}</el-descriptions-item>
        <el-descriptions-item label="起止时间" :span="4">{{ data.currentCourseDetail.start_time + '--' + data.currentCourseDetail.end_time}}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="4">{{ data.currentCourseDetail.desc }}</el-descriptions-item>
        <el-descriptions-item label="教学单位名" :span="4">{{ data.currentCourseDetail.college_name }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>

  <!-- 班级申请记录模态框 -->
  <el-dialog v-model="data.courseApplyDetailVisible" title="课程申请记录" width="1200" center>
    <div v-loading="data.courseApplyDetailLoading">
      <el-empty v-if="data.courseApplyList.length === 0 && !data.courseApplyDetailLoading" description="暂无申请班级记录信息"/>
      <el-table v-if="data.courseApplyList.length !== 0" :data="data.courseApplyList" border style="width: 100%">
        <el-table-column prop="class_name" label="班级名"/>
        <el-table-column prop="create_time" label="时间"/>
        <el-table-column prop="status_desc" label="审核状态"/>
        <!-- 右侧固定列 展示详情信息 -->
        <el-table-column fixed="right" label="操作">
          <template v-slot="scope">
            <el-button v-if="scope.row.status === 1" size="small" type="success" @click="passClassApplication(scope.row.id)">通过</el-button>
            <el-button v-if="scope.row.status === 1" size="small" type="danger" @click="refuseClassApplication(scope.row.id)">不通过</el-button>
            <el-button v-if="scope.row.status !== 1" type="danger" size="small" :disabled="scope.row.status !== 1" @click="removeCourseApply(scope.row.id)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>

  <!-- 实验详情框 -->
  <el-dialog v-model="data.experimentDetailVisible" title="实验详情" width="1200" center>
    <!-- 章节列表 -->
    <div class="experiment-dialog">
      <el-empty v-if="data.subcourseList.length === 0" description="暂无章节信息"/>
      <el-table v-if="data.subcourseList.length !== 0" :data="data.subcourseList" stripe border style="width: 100%" max-height="400">
        <el-table-column prop="name" label="名称" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="desc" label="描述" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="rate" label="实验说明" min-width="200" show-overflow-tooltip>
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="downloadFile(scope.row.files_info[0].url)">
              {{ scope.row.files_info[0].name }}
            </el-button>
          </template>
        </el-table-column>
        <!-- 右侧固定列 展示详情信息 -->
        <el-table-column fixed="right" label="操作" min-width="350" show-overflow-tooltip>
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="openExperiment()">进入实验</el-button>
            <el-button link type="primary" size="small" @click="openStuReport(data.currentExperimentId, scope.row.subcourse_id)">学习报告</el-button>
            <el-button link type='primary' size="small" @click="openClassProgressModal(scope.row.id)">学习进度</el-button>
            <el-button link type='primary' size="small" @click="openClassContainerModal(scope.row.subcourse_id)">查看容器</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination 
        v-if="data.subcourseList.length !== 0"
        background 
        layout="prev, pager, next"
        :total="data.total" 
        :page-size="data.count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="mt-4 mx-auto"
      />
    </div>
  </el-dialog>

  <!-- 创建镜像框 -->
  <el-dialog v-model="data.createImageModalVisible" title="创建镜像" width="600" center>
    <div class="experiment-dialog">
      <el-form :model="data.newImageForm" class="w-[30rem]">
        <!-- 选择源镜像 -->
        <el-form-item>
          <el-select v-model="data.newImageForm.image_id" placeholder="请选择源镜像" class="w-[30rem]">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Filter />
              </el-icon>
            </template>
            <el-option
              v-for="(item, index) in data.imageList"
              :key="index"
              :label="item['name']"
              :value="item['id']"
            />
          </el-select>
        </el-form-item>
        <!-- 创建镜像 -->
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitImageCreate()">创建镜像</el-button>
        </el-form-item>
        <!-- 镜像名称 -->
        <el-form-item>
          <el-input v-model="data.newImageForm.name" placeholder="请输入镜像名称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 镜像描述 -->
        <el-form-item>
          <el-input v-model="data.newImageForm.desc" placeholder="请输入镜像描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Edit />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="saveImageCreate()">保存镜像</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 修改镜像框 -->
  <el-dialog v-model="data.modifyImageModalVisible" title="修改镜像" width="600" center>
    <div class="experiment-dialog">
      <el-form :model="data.newImageForm" class="w-[30rem]">
        <!-- 选择源镜像 -->
        <el-form-item>
          <el-select v-model="data.newImageForm.image_id" placeholder="请选择源镜像" class="w-[30rem]">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Filter />
              </el-icon>
            </template>
            <el-option
              v-for="(item, index) in data.imageList"
              :key="index"
              :label="item['name']"
              :value="item['id']"
            />
          </el-select>
        </el-form-item>
        <!-- 创建镜像 -->
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitImageCreate()">创建镜像</el-button>
        </el-form-item>
        <!-- 镜像名称 -->
        <el-form-item>
          <el-input v-model="data.newImageForm.name" placeholder="请输入镜像名称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 镜像描述 -->
        <el-form-item>
          <el-input v-model="data.newImageForm.desc" placeholder="请输入镜像描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Edit />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="saveImageCreate()">保存镜像</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 班级通知框 -->
  <el-dialog v-model="data.classNotificationModalVisible" title="班级通知" width="1200" center>
    <div class="experiment-dialog">
      <!-- 搜索框 -->
      <div class="dialog-search-box">
        <div class="search-title">班级通知</div>
        <el-input v-model="data.inputNotification" style="width: 240px" class="mr-3" placeholder="请输入通知标题" />
        <el-button type="primary" class="mr-3" @click="searchNotification(data.currentExperimentId)" :loading="data.searchNotificationLoading">搜索</el-button>
        <el-button type="primary" class="mr-3" @click="openCreateNotificationModal()">创建新通知</el-button>
      </div>
      <!-- 通知列表 -->
      <div class="notification-list">
        <el-empty v-if="data.notificationList.length === 0" description="暂无通知" />
        <el-table v-else :data="data.notificationList" border style="width: 100%" max-height="400">
          <el-table-column prop="content" label="通知标题" show-overflow-tooltip min-width="200"/>
          <el-table-column prop="file" label="文件" show-overflow-tooltip min-width="200">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="downloadFile(scope.row.files_info[0].url)">
              {{ scope.row.files_info[0].name }}
            </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="发布时间" show-overflow-tooltip min-width="200"/>
          <el-table-column fixed="right" label="操作" show-overflow-tooltip min-width="200">
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
              <el-icon color="#409efc">
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 文件列表 -->
        <el-form-item>
          <el-upload 
            class="file-upload" 
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
              <div class="el-upload__tip">上传单个文件大小不能超过 20MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitNotificationCreate()" :loading="data.submitNotificationCreateLoading">创建新通知</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 查看学习进度框 -->
  <el-dialog v-model="data.classProgressModalVisible" title="学习进度" width="1200" center>
    <!-- 章节列表 -->
    <div class="experiment-dialog" v-loading="data.classProgressLoading">
      <el-empty v-if="data.studyProgressList.length === 0 && !data.classProgressLoading" description="暂无学习进度信息"/>
      <el-table v-if="data.studyProgressList.length !== 0" :data="data.studyProgressList" stripe border style="width: 100%">
        <el-table-column prop="subcourse_name" label="章节名"/>
        <el-table-column prop="user_id_number" label="学号"/>
        <el-table-column prop="user_name" label="学生名"/>
        <el-table-column prop="learn_time" label="已学习时间"/>
        <el-table-column prop="use_time" label="规定时间"/>
        <el-table-column label="是否完成">
          <template v-slot="scope">
            <span v-if="scope.row.use_time <= scope.row.learn_time">是</span>
            <span v-if="scope.row.use_time > scope.row.learn_time">否</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="data.studyProgressList.length !== 0"
        background 
        layout="prev, pager, next"
        :total="data.studyProgressTotal" 
        :page-size="data.studyProgressCount"
        @size-change="studyProgressSizeChange"
        @current-change="studyProgressCurrentChange"
        class="mt-4 mx-auto"
      />
    </div>
  </el-dialog>

  <!-- 查看容器框 -->
  <el-dialog v-model="data.checkContainerModalVisible" title="查看容器" width="1200" center>
    <!-- 章节列表 -->
    <div class="experiment-dialog" :loading="data.containerListLoading">
      <el-empty v-if="data.containerList.length === 0 && !data.containerListLoading" description="暂无容器信息"/>
      <el-table v-if="data.containerList.length !== 0" :data="data.containerList" stripe border style="width: 100%" max-height="400">
        <el-table-column label="序号" min-width="50" show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="学生姓名" min-width="100" show-overflow-tooltip/>
        <el-table-column prop="image_name" label="镜像" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="container_status" label="状态" min-width="100" show-overflow-tooltip/>
        <!-- 右侧固定列 展示详情信息 -->
        <el-table-column fixed="right" label="操作" min-width="160">
          <template v-slot="scope">
            <el-button v-if="scope.row.container_status != 'delete' && scope.row.container_status != 'exited'" link type="primary" size="small" @click="enterContainer(scope.row.addr)">进入容器</el-button>
            <el-button v-if="scope.row.container_status != 'exited' && scope.row.container_status != 'delete'" link type="primary" size="small" @click="ceaseContainer(scope.row.container_id)">停止容器</el-button>
            <el-button v-if="scope.row.container_status == 'exited' && scope.row.container_status != 'delete'" link type="primary" size="small" @click="launchContainer(scope.row.container_id)">启动容器</el-button>
            <el-button v-if="scope.row.container_status != 'delete'" link type="primary" size="small" @click="removeContainer(scope.row.container_id)">删除容器</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="data.containerList.length !== 0"
        background 
        layout="prev, pager, next"
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
.class-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  box-sizing: border-box;
  @apply bg-light-50 p-1 rounded-md;
}
.banner {
  width: 100%;
  height: 20%;
  @apply rounded-md;
}
/* 主内容区域 */
.experiment-tabs {
  height: 100%;
  width: 100%;
}
.experiment-pane {
  height: 100%;
  width: 100%;
}
.course-main {
  @apply flex flex-col mt-3;
}
/* 实验列表 */
.experiment-list-container {
  width: 100%;
  height: 100%;
  @apply pt-1 pl-1 flex flex-row;
}
.experiment-card {
  width: 90%;
  height: 310px;
  margin-top: 2rem;
  border-radius: 10px;
  overflow: hidden;
  border: #d1d5db solid 1px;
  transition: all .2s;
}
.experiment-card:hover {
  transform: scale(1.05);
}
.experiment-card-main {
  @apply p-3 text-sky-500;
}
.experiment-card-btn {
  @apply p-1 flex flex-row justify-center;
}
.experiment-title {
  display: block;
  @apply font-medium;
}
/* 模态框 */
.experiment-dialog {
  @apply flex items-center justify-center flex-col;
}
.class-description {
  width: 100%;
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
.file-upload {
  width: 100%;
}
.select-course {
  @apply flex flex-row;
}
.course-list {
  @apply flex flex-col mt-4 mr-2;
}
.notification-list {
  width: 100%;
  @apply flex flex-col mt-4 mr-2;
}
.experiment_area {
  @apply flex flex-col justify-center;
}
</style>
