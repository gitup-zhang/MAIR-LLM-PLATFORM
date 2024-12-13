<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, ChatDotRound, Connection, AlarmClock, UploadFilled, Notebook } from '@element-plus/icons-vue'
import { getChapterList, createChapter, getChapterDetail, modifyChapter, getChapterOption } from '@/apis/chapter';
import { getCourseInfoList, createCourse, getCourseDetail, modifyCourse, getCourseChapterList, deleteCourseChapter, addChapter } from '@/apis/course';
import { getImageOptions } from '@/apis/image'

const data = reactive({
  activeName: 'first',
  // 选中
  currentChapterId: 0,
  currentCourseId: 0,
  currentCourseChapterId: 0,
  // 章节名称输入
  inputChapter: '',
  inputCourse: '',
  // 列表
  chapterList: [],
  courseList: [],
  courseChapterList: [],
  // 表单
  newChapterForm: {
    name: '',
    desc: '',
    files_info: [] as any,
    supplement_files_info: [] as any,
    image_id: 0,
    use_time: 0
  },
  newCourseForm: {
    name: '',
    desc: '',
    total_time: 0
  },
  courseForm: {
    id: 0,
    modify_time: '',
    create_time: '',
    name: '',
    desc: '',
    total_time: 0
  },
  chapterForm: {
    name: '',
    desc: '',
    files_info: [] as any,
    supplement_files_info: [] as any,
    image_id: 0,
    use_time: 0
  },
  // 模态框
  createChapterModalVisible: false,
  modifyChapterModalVisible: false,
  createCourseModalVisible: false,
  modifyCourseModalVisible: false,
  addChapterModalVisible: false,
  // 选项
  imageOptions: [],
  chapterOptions: [] as any,
  // 分页
  chapterPage: 1,
  chapterCount: 10,
  chapterTotal: 0,
  coursePage: 1,
  courseCount: 10,
  courseTotal: 0,
  courseChapterPage: 1,
  courseChapterCount: 10,
  courseChapterTotal: 0,
  // 文件上传
  fileUploadUrl: '',
  fileLimit: 1
})

// 搜索章节
const searchChapter = async () => {
  const res = await getChapterList(data.inputChapter, data.chapterPage, data.chapterCount);
  data.chapterList = res.data.list;
  data.chapterTotal = res.data.total;
}
// 打开章节创建模态框
const openChapterCreateModal = async () => {
  data.createChapterModalVisible = true;
  const res = await getImageOptions();
  data.imageOptions = res.data.list;
  data.newChapterForm.image_id = data.imageOptions[0]['id'];
}
// 提交章节创建
const submitChapterCreate = async () => {
  const res = await createChapter(data.newChapterForm);
  if(res.status === 0){
    ElMessage({
      message: '新章节创建成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '新章节创建失败',
      type: 'warning',
      plain: true,
    })
  }
  data.createChapterModalVisible = false;
  searchChapter();
}
// 文件移除时的钩子
const handleRemove = (uploadFile: any, uploadFiles: any) => {
  if(!uploadFile.file_id){
    return;
  }
  data.newChapterForm.files_info = [];
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
  data.newChapterForm.files_info = [
    {
      name: res.data.name,
      url: res.data.url,
      file_id: res.data.file_id,
      group_name: res.data.group_name
    }
  ]
}
// 上传文件之前的钩子
const beforeUpload = (rawFile: any) => {
  // 检查文件类型
  const checkFileType = rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1) === 'pdf';
  if(!checkFileType) {
    ElMessage({
      message: '只接收PDF类型的文件',
      type: 'warning',
      plain: true,
    })
    return false;
  }
  const isLimit20MB = rawFile.size / 1024 / 1024 < 20;
  if(!isLimit20MB){
    ElMessage({
      message: '上传单个文件且大小不能超过20MB',
      type: 'warning',
      plain: true,
    })
    return false;
  }
  return true;
}
// 辅助文件移除时的钩子
const handleRemoveSupplement = (uploadFile: any, uploadFiles: any) => {
  if(!uploadFile.file_id){
    return;
  }
  data.newChapterForm.supplement_files_info = [];
}
// 辅助文件上传成功时的钩子
const handleSuccessSupplement = (res: any, file: any) => {
  data.newChapterForm.supplement_files_info = [{
    name: res.data.name,
    url: res.data.url,
    file_id: res.data.file_id,
    group_name: res.data.group_name
  }]
}
// 上传文件之前的钩子
const beforeUploadSupplement = (rawFile: any) => {
  // 检查文件类型
  const checkFileType = rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1) === 'pdf';
  if(!checkFileType) {
    ElMessage({
      message: '只接收PDF类型的文件',
      type: 'warning',
      plain: true,
    })
    return false;
  }
  const isLimit20MB = rawFile.size / 1024 / 1024 < 20;
  if(!isLimit20MB){
    ElMessage({
      message: '上传单个文件且大小不能超过20MB',
      type: 'warning',
      plain: true,
    })
    return false;
  }
  return true;
}
// 打开修改章节模态框
const openModifyChapterModal = async (id: number) => {
  data.currentChapterId = id;
  data.modifyChapterModalVisible = true;
  const res = await getChapterDetail(id);
  data.chapterForm = res.data;
}
// 提交章节修改
const submitChapterModify = async () => {
  const res = await modifyChapter(data.currentChapterId, data.chapterForm);
  if(res.status === 0){
    ElMessage({
      message: '章节修改成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '章节修改失败',
      type: 'warning',
      plain: true,
    })
  }
  data.modifyChapterModalVisible = false;
  searchChapter();
}
// 章节分页
const chapterSizeChange = (val: any) => {
  searchChapter();
}
const chapterCurrentChange = (val: any) => {
  data.chapterPage = val;
  searchChapter();
}


// 搜索课程
const searchCourse = async () => {
  const res = await getCourseInfoList(data.inputCourse, data.coursePage, data.courseCount);
  data.courseList = res.data.list;
  data.courseTotal = res.data.total;
}
// 提交课程创建
const submitCourseCreate = async () => {
  const res = await createCourse(data.newCourseForm);
  if(res.status === 0){
    ElMessage({
      message: '新课程创建成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '新课程创建失败',
      type: 'warning',
      plain: true,
    })
  }
  data.createCourseModalVisible = false;
  searchCourse();
}
// 打开课程修改模态框
const openCourseModifyModal = async (courseId: number) => {
  data.modifyCourseModalVisible = true;
  const res = await getCourseDetail(courseId);
  data.courseForm.name = res.data.name;
  data.courseForm.create_time = res.data.create_time;
  data.courseForm.desc = res.data.desc;
  data.courseForm.id = res.data.id;
  data.courseForm.modify_time = res.data.modify_time;
  data.courseForm.total_time = res.data.total_time;
}
// 提交课程修改
const submitCourseModify = async () => {
  const res = await modifyCourse(data.courseForm.id, data.courseForm);
  if(res.status === 0){
    ElMessage({
      message: '课程修改成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '课程修改失败',
      type: 'warning',
      plain: true,
    })
  }
  data.modifyCourseModalVisible = false;
  searchCourse();
}
// 课程分页
const courseSizeChange = (val: any) => {
  searchCourse();
}
const courseCurrentChange = (val: any) => {
  data.coursePage = val;
  searchCourse();
}
// 打开添加章节框
const openChapterAddModal = async (id: number) => {
  data.currentCourseId = id;
  data.addChapterModalVisible = true;
  const res = await getCourseChapterList(id, data.courseChapterPage, data.courseChapterCount);
  data.courseChapterList = res.data.list;
  data.courseChapterTotal = res.data.total;
  const result = await getChapterOption();
  data.chapterOptions = result.data;
}
// 添加章节
const addCourseChapter = async () => {
  if(data.currentCourseChapterId === 0){
    ElMessage({
      message: '请选择章节',
      type: 'warning',
      plain: true,
    })
  }
  const res = await addChapter(data.currentCourseId, data.currentCourseChapterId);
  if(res.status === 0){
    ElMessage({
      message: '章节添加成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '章节添加失败',
      type: 'warning',
      plain: true,
    })
  }
  openChapterAddModal(data.currentCourseId);
}
// 删除课程中的章节
const removeCourseChapter = async (id: number) => {
  const res = await deleteCourseChapter(id);
  if(res.status === 0){
    ElMessage({
      message: '章节删除成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '章节删除失败',
      type: 'warning',
      plain: true,
    })
  }
  data.addChapterModalVisible = false;
  openChapterAddModal(data.currentCourseId);
}
// 添加章节分页
const courseChapterSizeChange = (val: any) => {
  openChapterAddModal(data.currentCourseId);
}
const courseChapterCurrentChange = (val: any) => {
  data.courseChapterPage = val;
  openChapterAddModal(data.currentCourseId);
}


onMounted(() => {
  // 挂载数据
  searchChapter();
  searchCourse();
  data.fileUploadUrl = 'http://8.155.19.142:30027/olexp_server/file/';
})
</script>

<template>
  <div class="course-page">
    <el-tabs v-model="data.activeName" type="border-card" class="course-tabs">
      <!-- 章节管理 -->
      <el-tab-pane label="章节管理" name="first" class="course-pane">
        <div class="search-box">
          <div class="search-title">章节管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputChapter" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入章节名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchChapter()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="openChapterCreateModal()">创建新章节</el-button>
          </div>
        </div>
        <!-- 所有章节信息展示 -->
        <div class="show-list">
          <el-empty v-if="data.chapterList.length === 0" description="暂无章节信息"/>
          <el-table v-if="data.chapterList.length !== 0" :data="data.chapterList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="name" label="章节名"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="use_time" label="课时"/>
            <el-table-column prop="image_name" label="镜像"/>
            <el-table-column label="文件">
              <template v-slot="scope">
                <!-- {{ scope.row.files_info[0].name }} -->
                {{ scope.row.files_info }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="openModifyChapterModal(scope.row.id)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-if="data.chapterList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.chapterTotal" 
            :page-size="data.chapterCount"
            @size-change="chapterSizeChange"
            @current-change="chapterCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>

      <!-- 课程管理 -->
      <el-tab-pane label="课程管理" name="second">
        <div class="search-box">
          <div class="search-title">课程管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputCourse" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入课程名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchCourse()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="data.createCourseModalVisible = true">创建新课程</el-button>
          </div>
        </div>
        <!-- 所有课程信息展示 -->
        <div class="show-list">
          <el-empty v-if="data.courseList.length === 0" description="暂无课程信息"/>
          <el-table v-if="data.courseList.length !== 0" :data="data.courseList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="name" label="课程名"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="total_time" label="总学时"/>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="openCourseModifyModal(scope.row.id)">修改</el-button>
                <el-button link type="primary" size="small" @click="openChapterAddModal(scope.row.id)">添加章节</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-if="data.courseList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.courseTotal" 
            :page-size="data.courseCount"
            @size-change="courseSizeChange"
            @current-change="courseCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- 创建新章节框 -->
  <el-dialog v-model="data.createChapterModalVisible" title="章节创建" width="600" center>
    <div class="course-dialog">
      <el-form :model="data.newChapterForm" class="w-[30rem]">
        <!-- 章节名 -->
        <el-form-item>
          <el-input v-model="data.newChapterForm.name" placeholder="请输入章节名称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 章节描述 -->
        <el-form-item>
          <el-input v-model="data.newChapterForm.desc" placeholder="请输入章节描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <ChatDotRound />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 镜像 -->
        <el-form-item>
          <el-select v-model="data.newChapterForm.image_id" placeholder="请选择镜像">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Connection />
              </el-icon>
            </template>
            <el-option
              v-for="(item, index) in data.imageOptions"
              :key="index"
              :label="item['name']"
              :value="item['id']"
            />
          </el-select>
        </el-form-item>
        <!-- 课时 -->
        <el-form-item>
          <el-input v-model="data.newChapterForm.use_time" placeholder="请输入课时">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <AlarmClock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 章节内容 -->
        <el-form-item>
          <el-upload
            drag
            class="w-[30rem]"
            :action="data.fileUploadUrl"
            :on-remove="handleRemove" 
            :before-remove="beforeRemove" 
            :limit="data.fileLimit"
            :on-exceed="handleExceed" 
            :file-list="data.newChapterForm.files_info" 
            :on-success="handleSuccess" 
            :before-upload="beforeUpload"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              <em>章节内容</em>拖拽文件到此处或点击上传
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请上传单个PDF文件且大小不能超过50MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <!-- 辅助文件 -->
        <el-form-item>
          <el-upload
            class="w-[30rem]"
            drag
            :action="data.fileUploadUrl"
            :on-remove="handleRemoveSupplement" 
            :before-remove="beforeRemove"
            :limit="data.fileLimit"
            :on-exceed="handleExceed"
            :file-list="data.newChapterForm.supplement_files_info" 
            :on-success="handleSuccessSupplement" 
            :before-upload="beforeUploadSupplement"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              <em>辅助文件</em>拖拽文件到此处或点击上传
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请上传单个PDF文件且大小不能超过50MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <!-- 创建按钮 -->
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitChapterCreate()">创建新章节</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 修改章节框 -->
  <el-dialog v-model="data.modifyChapterModalVisible" title="章节修改" width="600" center>
    <div class="course-dialog">
      <el-form :model="data.chapterForm" class="w-[30rem]">
        <!-- 章节名 -->
        <el-form-item>
          <el-input v-model="data.chapterForm.name" placeholder="请输入章节名称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 章节描述 -->
        <el-form-item>
          <el-input v-model="data.chapterForm.desc" placeholder="请输入章节描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <ChatDotRound />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 镜像 -->
        <el-form-item>
          <el-select v-model="data.chapterForm.image_id" placeholder="请选择镜像">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Connection />
              </el-icon>
            </template>
            <el-option
              v-for="(item, index) in data.imageOptions"
              :key="index"
              :label="item['name']"
              :value="item['id']"
            />
          </el-select>
        </el-form-item>
        <!-- 课时 -->
        <el-form-item>
          <el-input v-model="data.chapterForm.use_time" placeholder="请输入课时">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <AlarmClock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 章节内容 -->
        <el-form-item>
          <el-upload
            drag
            class="w-[30rem]"
            :action="data.fileUploadUrl"
            :on-remove="handleRemove" 
            :before-remove="beforeRemove" 
            :limit="data.fileLimit"
            :on-exceed="handleExceed" 
            :file-list="data.chapterForm.files_info" 
            :on-success="handleSuccess" 
            :before-upload="beforeUpload"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              <em>章节内容</em>拖拽文件到此处或点击上传
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请上传单个PDF文件且大小不能超过50MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <!-- 辅助文件 -->
        <el-form-item>
          <el-upload
            class="w-[30rem]"
            drag
            :action="data.fileUploadUrl"
            :on-remove="handleRemoveSupplement" 
            :before-remove="beforeRemove"
            :limit="data.fileLimit"
            :on-exceed="handleExceed"
            :file-list="data.chapterForm.supplement_files_info" 
            :on-success="handleSuccessSupplement" 
            :before-upload="beforeUploadSupplement"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              <em>辅助文件</em>拖拽文件到此处或点击上传
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请上传单个PDF文件且大小不能超过50MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <!-- 创建按钮 -->
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitChapterModify()">提交修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 创建新课程框 -->
  <el-dialog v-model="data.createCourseModalVisible" title="课程创建" width="600" center>
    <div class="course-dialog">
      <el-form :model="data.newChapterForm" class="w-[30rem]">
        <!-- 课程名 -->
        <el-form-item>
          <el-input v-model="data.newCourseForm.name" placeholder="请输入课程名称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Notebook />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item>
          <el-input v-model="data.newCourseForm.desc" placeholder="请输入课程描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <ChatDotRound />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 创建按钮 -->
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitCourseCreate()">创建新课程</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 修改课程框 -->
  <el-dialog v-model="data.modifyCourseModalVisible" title="课程修改" width="600" center>
    <div class="course-dialog">
      <el-form :model="data.courseForm" class="w-[30rem]">
        <!-- 课程名 -->
        <el-form-item>
          <el-input v-model="data.courseForm.name" placeholder="请输入课程名称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Notebook />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item>
          <el-input v-model="data.courseForm.desc" placeholder="请输入课程描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <ChatDotRound />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 总学时 -->
        <el-form-item>
          <el-input v-model="data.courseForm.total_time" placeholder="请输入课程学时" disabled="disabled">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <AlarmClock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 创建按钮 -->
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitCourseModify()">提交课程修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 添加章节框 -->
  <el-dialog v-model="data.addChapterModalVisible" title="添加章节" width="1200" center>
    <div class="dialog-search-box">
      <div class="search-title">添加章节</div>
      <el-select v-model="data.currentCourseChapterId" placeholder="请选择章节" style="width:70%" filterable>
        <el-option 
          v-for="item in data.chapterOptions" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" class="ml-1" @click="addCourseChapter()">添加章节</el-button>
    </div>
    <div class="course-dialog">
      <el-table :data="data.courseChapterList" border style="width: 100%">
        <el-table-column prop="id" label="ID"/>
        <el-table-column prop="name" label="章节名"/>
        <el-table-column prop="desc" label="描述"/>
        <el-table-column prop="use_time" label="课时"/>
        <el-table-column prop="image_name" label="镜像"/>
        <el-table-column label="文件">
          <template v-slot="scope">
            <!-- {{ scope.row.files_info[0].name }} -->
            {{ scope.row.files_info }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="removeCourseChapter(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background 
        layout="prev, pager, next"
        :total="data.courseChapterTotal" 
        :page-size="data.courseChapterCount"
        @size-change="courseChapterSizeChange"
        @current-change="courseChapterCurrentChange"
        class="mt-4 mx-auto"
      />
    </div>
  </el-dialog>
</template>

<style scoped>
/* 整体页面设置 */
.course-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.course-tabs {
  height: 100%;
  width: 100%;
}
.course-pane {
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
/* 模态框 */
.course-dialog {
  @apply flex items-center justify-center flex-col;
}
.dialog-search-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md mb-2;
}
</style>
