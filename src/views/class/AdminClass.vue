<script setup lang="ts">
// 教师课程页
import { onMounted, reactive } from "vue"
import { ElMessage } from 'element-plus';
import { Document, Edit, Filter } from '@element-plus/icons-vue'
import { getCourseDetailInfo } from '@/apis/experiment'
import { getCourseList, getCourseApplyRecord, deleteCourseApply } from '@/apis/course'
import { getClassList, getManagedClassList, getTeachedClassList, passClassApply, refuseClassApply } from '@/apis/class'
import { getImageInfo, deleteImage, createImage, buildImage } from '@/apis/image'
import { useUserStore } from '@/stores/user'
import { useRouter } from "vue-router"

const userStore = useUserStore();
const router = useRouter();

const data = reactive({
  activeName: 'first',
  inputImage: '',
  searchText: '',
  searchManageClassText: '',
  currentExperimentId: -1,
  // 全部班级信息
  courseList: [],
  experimentList: [],
  teachExperimentList: [],
  imageList: [] as any,
  // 课程内部的详细列表
  subcourseList: [],
  // 当前选中的班级信息
  currentCourseDetail: [],
  // 已报名班级信息
  enrolledClassList: [],
  // 管理的班级列表
  managedClassList: [],
  // 班级申请记录
  courseApplyList: [],
  // 新表单
  newImageForm: {
    image_id: 0 || '',
    desc: '',
    container_id: '',
    name: ''
  },
  // 容器地址
  containerAddr: '',
  // 分页相关
  page: 1,
  count: 10,
  total: 0,
  courseDetailVisible: false,
  courseApplyDetailVisible: false,
  classNotificationVisible: false,
  experimentDetailVisible: false,
  createImageModalVisible: false,
  modifyImageModalVisible: false
})

// 搜索申请的班级
const searchMyClass = async () => {
  const res = await getClassList(data.page, data.count);
  data.enrolledClassList = res.data.list;
  data.experimentList = res.data.list;
}
// 搜索课程
const searchCourse = async () => {
  const res = await getCourseList(data.searchText, data.page, data.count);
  data.courseList = res.data.list;
}
// 查看课程申请记录
const getCourseApplyDetail = async () => {
  data.courseApplyDetailVisible = true;
  const res = await getCourseApplyRecord(userStore.id, data.page, data.count);
  data.courseApplyList = res.data.list;
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
}
// 搜索管理的班级
const searchManagedClass = async () => {
  const res = await getManagedClassList(data.searchManageClassText, data.page, data.count);
  data.managedClassList = res.data.list;
}
// 取消申请
const removeCourseApply = async (applyId:number) => {
  const res = deleteCourseApply(applyId);
  // 刷新
  getCourseApplyDetail()
}
// 查看课程详情
const getCourseDetail = (courseDetail: any) => {
  data.courseDetailVisible = true;
  data.currentCourseDetail = courseDetail;
}
// 获取考试安排信息
const goExamArrangement = (id: number) => {
  router.push({
    path: "/classExam",
    query: {
      id: id
    }
  })
}
// 获取课程详情
const getExperimentDetail = async (courseId:number, page:number, count:number) => {
  const res = await getCourseDetailInfo(courseId, page, count);
  data.subcourseList = res.data.list;
}

// 进入课程
const openExperimentDetailModal = (courseId: number) => {
  data.currentExperimentId = courseId;
  data.experimentDetailVisible = true;
  getExperimentDetail(courseId, 1, 10);
}
// 进入实验
const openExperiment = () => {
  data.experimentDetailVisible = false
  router.push("/experimentConduct")
}
// 进入学生课程报告页面
const openStuReport = (courseId: number, subcourseId: number) => {
  data.experimentDetailVisible = false
  router.push({
    path: "/stuCourseReport",
    query: {
      courseId: courseId, 
      subcourseId: subcourseId
    }
  })
}
// 搜索授课实验信息
const searchTeachedExperiment = async () => {
  const res = await getTeachedClassList(data.page, data.count);
  data.teachExperimentList = res.data.list;
}


// 获取班级通知
const openClassNotificationModal = (id: number) => {
  
  
}

// 搜索镜像
const searchImage = async () => {
  const res = await getImageInfo();
  data.imageList = res.data.normal_image_list;
  data.total = res.data.total;
}
// 获取镜像相关信息
const getImageData = async () => {
  var tmp = {} as any;
  if (sessionStorage.image_id === '-1') {
    const res = await getImageInfo();
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
      type: 'warning',
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
      type: 'warning',
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
        type: 'warning',
        plain: true,
      })
    }
  }
}

onMounted(() => {
  // 初始化
  searchMyClass();
  searchCourse();
  searchManagedClass();
  searchTeachedExperiment();
  searchImage();
})
</script>

<template>
  <div class="course-page">
    <el-tabs v-model="data.activeName" type="border-card" class="course-tabs">
      <el-tab-pane label="班级信息" name="first" class="course-pane">
        <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
        <div class="course-main">
          <!-- 课程搜索框 -->
          <div class="select-course">
            <!-- 搜索 -->
            <el-input v-model="data.searchText" style="width: 240px" class="mr-3" placeholder="请输入课程名称" />
            <el-button type="primary" class="mr-3" @click="searchCourse()">搜索</el-button>
            <el-button type="primary" class="ml-3" @click="getCourseApplyDetail()">班级申请记录</el-button>
          </div>
          <!-- 所有班级列表展示 -->
          <div class="course-list">
            <el-table :data="data.courseList" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="50" />
              <el-table-column prop="name" label="班级名"/>
              <el-table-column prop="course_name" label="课程名"/>
              <el-table-column prop="teacher_name" label="教师名"/>
              <el-table-column prop="capacity" label="学生数量"/>
              <el-table-column prop="end_time" label="截止时间"/>
              <el-table-column prop="college_name" label="教学单位名"/>
              <el-table-column prop="not_apply_reason" label="申请状态"/>
              <!-- 右侧固定列 展示详情信息 -->
              <el-table-column fixed="right" label="操作" min-width="60">
                <template v-slot="scope">
                  <el-button link type="primary" size="small" @click="getCourseDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已报名班级" name="second" class="course-pane">
        <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
        <div v-if="data.enrolledClassList.length != 0" class="course-list">
          <el-table :data="data.enrolledClassList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="50" />
            <el-table-column prop="name" label="班级名"/>
            <el-table-column prop="course_name" label="课程名"/>
            <el-table-column prop="teacher_name" label="教师名"/>
            <el-table-column prop="capacity" label="学生数量"/>
            <el-table-column prop="end_time" label="截止时间"/>
            <el-table-column prop="college_name" label="教学单位名"/>
            <el-table-column prop="not_apply_reason" label="申请状态"/>
            <!-- 右侧固定列 展示详情信息 -->
            <el-table-column fixed="right" label="操作" min-width="60">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="getCourseDetail(scope.row)">详情</el-button>
                
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
        </div>
        <div v-else>
          <el-empty description="暂无已报名班级信息" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="管理的班级" name="third" class="course-pane">
        <img src="../../assets/img/banner.png" class="banner" alt="大模型实训平台">
        <div v-if="data.managedClassList.length != 0" class="select-course mt-3">
          <!-- 搜索 -->
          <el-input v-model="data.searchManageClassText" style="width: 240px" class="mr-3" placeholder="请输入课程名称" />
          <el-button type="primary" class="mr-3" @click="searchManagedClass()">搜索</el-button>
        </div>
        <div v-if="data.managedClassList.length != 0" class="course-list">
          <el-table :data="data.managedClassList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="50" />
            <el-table-column prop="name" label="班级名"/>
            <el-table-column prop="course_name" label="课程名"/>
            <el-table-column label="学生量" width="120">
              <template v-slot="scope">
                {{scope.row.student_num}} / {{ scope.row.capacity }}
              </template>
            </el-table-column>
            <el-table-column label="启止时间">
              <template v-slot="scope">
                {{ scope.row.start_time + ' -- ' + scope.row.end_time }}
              </template>
            </el-table-column>
            <el-table-column prop="college_name" label="教学单位名"/>
            <el-table-column prop="not_apply_reason" label="申请状态"/>
            <!-- 右侧固定列 展示详情信息 -->
            <el-table-column fixed="right" label="操作" min-width="60">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="getCourseDetail(scope.row)">详情</el-button>
                <el-button link type="primary" size="small" @click="goExamArrangement(scope.row.id)">考试安排</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
        </div>
        <div v-else>
          <el-empty description="暂无管理的班级信息" />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="已选实验" name="fourth" class="course-pane">
        <el-row v-if="data.experimentList.length != 0" class="card-main">
          <el-col :span="8" v-for="experiemnt in data.experimentList" :key="experiemnt.id"> -->
            <!-- 课程卡片 -->
            <!-- <el-card body-style="padding:0px" class="course-card"> -->
              <!-- 配图 -->
              <!-- <img src="@/assets/img/course.png" style="width: 100%"/>
              <div class="course-card-main">
                <span class="course-title">{{ experiemnt.name }}</span>
                <el-button type='primary' text>{{ experiemnt.student_num }}课时</el-button>
                <el-button type='primary' text @click="openClassNotificationModal(experiemnt.id)">班级通知</el-button>
                <el-button type='primary' text @click="openExperimentDetailModal(experiemnt.id)">进入课程</el-button>
                <el-button type='primary' text @click="openClassNotificationModal(experiemnt.id)">查看容器</el-button>
                <el-button type='primary' text @click="openExperimentDetailModal(experiemnt.id)">学习进度</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-else>
          <el-empty description="暂无已选实验信息" />
        </div>
      </el-tab-pane> -->
      <el-tab-pane label="授课实验" name="fifth" class="course-pane">
        <el-row v-if="data.teachExperimentList.length != 0" class="card-main">
          <el-col :span="8" v-for="experiemnt in data.teachExperimentList" :key="experiemnt.id">
            <!-- 课程卡片 -->
            <el-card body-style="padding:0px" class="course-card">
              <!-- 配图 -->
              <img src="@/assets/img/course.png" style="width: 100%"/>
              <div class="course-card-main">
                <span class="course-title">{{ experiemnt.name }}</span>
                <el-button type='primary' text>{{ experiemnt.student_num }}课时</el-button>
                <el-button type='primary' text @click="openClassNotificationModal(experiemnt.id)">班级通知</el-button>
                <el-button type='primary' text @click="openExperimentDetailModal(experiemnt.id)">进入课程</el-button>
                <el-button type='primary' text @click="openClassNotificationModal(experiemnt.id)">查看容器</el-button>
                <el-button type='primary' text @click="openExperimentDetailModal(experiemnt.id)">学习进度</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-else>
          <el-empty description="暂无授课实验信息" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="镜像管理" name="sixth" class="course-pane">
        <div class="search-box">
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputImage" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入镜像名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchImage()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="addImage(-1)">创建新镜像</el-button>
          </div>
        </div>
        <!-- 所有镜像信息展示 -->
        <div class="course-list">
          <el-table :data="data.imageList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
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
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- 班级详情模态框 -->
  <el-dialog v-model="data.courseDetailVisible" title="班级详细信息" width="600">
    <div class="course-detail-dialog">
      <el-descriptions
        direction="vertical"
        :column="4"
        border
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
  <el-dialog v-model="data.courseApplyDetailVisible" title="课程申请记录" width="800">
    <el-table :data="data.courseApplyList" border style="width: 100%">
          <el-table-column prop="class_id" label="ID"/>
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
  </el-dialog>
  <!-- 实验详情框 -->
  <el-dialog v-model="data.experimentDetailVisible" title="实验详情" class="experimentDetailModal">
    <!-- 章节列表 -->
    <div class="chapter-list">
      <el-table :data="data.subcourseList" stripe border style="width: 100%">
        <el-table-column prop="id" label="章节" width="60" />
        <el-table-column prop="name" label="名称" width="80" />
        <el-table-column prop="desc" label="描述" />
        <el-table-column prop="rate" label="进度" />
        <!-- 右侧固定列 展示详情信息 -->
        <el-table-column fixed="right" label="操作" min-width="60">
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="openExperiment()">进入实验</el-button>
            <el-button link type="primary" size="small" @click="openStuReport(data.currentExperimentId, scope.row.id)">学习报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
  <!-- 创建镜像框 -->
  <el-dialog v-model="data.createImageModalVisible" title="创建镜像" width="600">
    <div class="admin-class-dialog">
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
  <el-dialog v-model="data.modifyImageModalVisible" title="修改镜像" width="600">
    <div class="admin-class-dialog">
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
  <el-dialog v-model="data.classNotificationVisible" title="班级通知" class="experimentDetailModal">
    <!-- 搜索框 -->
    <div class="notification-header">
      <el-input v-model="testInput" style="width: 240px" class="mr-3" placeholder="请输入内容" />
      <el-button type="primary" class="mr-3">搜索</el-button>
    </div>
    <!-- 通知列表 -->
    <div class="notification-list">
      <el-table :data="notificationData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="content" label="通知内容"/>
        <el-table-column prop="file" label="文件"/>
        <el-table-column prop="time" label="发布时间" />
      </el-table>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 整体页面设置 */
.course-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  box-sizing: border-box;
  @apply bg-light-50 p-1 rounded-md;
}

/* 主内容区域 */
.banner {
  width: 100%;
  height: 20%;
  @apply rounded-md;
}
.course-tabs {
  height: 100%;
  width: 100%;
}


.course-main {
  @apply flex flex-col mt-3;
}
.select-course {
  @apply flex flex-row;
}
.course-list {
  @apply flex flex-col mt-4 mr-2;
}

.heading {
  @apply text-xl font-semibold ml-2 text-sky-400;
}

/* 班级详情模态框 */
.course-detail-dialog {

}
.card-main {
  width: 100%;
  height: 100%;
}
.course-card {
  width: 400px;
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
  @apply font-medium;
}
.notification-header {
  @apply mb-2;
}

/* 模态框 */
.admin-class-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
