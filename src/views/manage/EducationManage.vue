<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';
import { OfficeBuilding, User, Notebook, Location } from '@element-plus/icons-vue'
import { getLocationList, deleteLocation, getLocationDetail, modifyLocationDetail, createLocation, getLocationOption } from '@/apis/location';
import { getCollegeList, getCollegeDetail, submitCollegeModifyInfo, createCollege, deleteCollege, getCollegeOptions } from '@/apis/college';
import { getCourseList, getCourseOptions } from '@/apis/course';
import { getClassApplyList, evaluateClassApply, createClass, getClassDetail, modifyClass } from '@/apis/class';
import { getTeacherOptions } from '@/apis/user';

const router = useRouter();
const data = reactive({
  activeName: 'first',
  // 输入框
  inputLocation: '',
  inputCollege: '',
  inputClass: '',
  inputClassApply: '',
  // 模态框
  modifyLocationModalVisible: false,
  modifyCollegeModalVisible: false,
  modifyClassModalVisible: false,
  createLocationModalVisible: false,
  createCollegeModalVisible: false,
  createClassModalVisible: false,
  classApplyModalVisible: false,
  // 表单
  locationForm: {
    id: 0,
    name: '',
    parentId: 0
  },
  collegeForm: {} as any,
  // 创建表单
  newLocationForm: {
    name: '',
    parent_id: 0
  },
  newCollegeForm: {
    name: '',
    area_id: 0
  },
  newClassForm: {
    name: '',
    teacher_id: undefined,
    course_id: undefined,
    capacity: 0,
    time_range: [],
    desc: '',
    start_time: '',
    end_time: '',
    cover_image: '',
    college_id: undefined
  },
  // 列表
  locationList: [],
  collegeList: [],
  classList: [],
  classApplyList: [],
  // 当前选中项
  currentClass: {} as any,
  // 当前选中项ID
  currentClassId: 0,
  // 选项
  collegeOptions: [] as any,
  courseOptions: [] as any,
  teacherOptions: [] as any,
  locationOptions: [] as any, 
  // 分页
  locationTotal: 0,
  locationPage: 1,
  locationCount: 10,
  collegeTotal: 0,
  collegePage: 1,
  collegeCount: 10,
  classTotal: 0,
  classPage: 1,
  classCount: 10,
  classApplyTotal: 0,
  classApplyPage: 1,
  classApplyCount: 10,
})

// 搜索地区
const searchLocation = async () => {
  const res = await getLocationList(data.inputLocation, data.locationPage, data.locationCount);
  data.locationList = res.data.list;
  data.locationTotal = res.data.total;
}
// 提交地区创建
const submitLocationCreate = async () => {
  data.newLocationForm.parent_id = Number(data.newLocationForm.parent_id);
  const res = await createLocation(data.newLocationForm)
  if(res.status === 0){
    ElMessage({
      message: '创建成功',
      type: 'success',
      plain: true,
    })
    data.createLocationModalVisible = false;
  } else {
    ElMessage({
      message: '创建失败',
      type: 'warning',
      plain: true,
    })
  }
  searchLocation();
  searchCollege();
}
// 删除地区
const removeLocation = async (id: number) => {
  const res = await deleteLocation(id);
  if(res.status === 0){
    ElMessage({
      message: '删除成功',
      type: 'success',
      plain: true,
    })
    // 刷新数据
    searchLocation();
  } else {
    ElMessage({
      message: '删除失败',
      type: 'warning',
      plain: true,
    })
  }
}
// 修改地区
const modityLocationDetail = async (id: number) => {
  // 打开模态框
  data.modifyLocationModalVisible = true;
  const res = await getLocationDetail(id);
  data.locationForm.name = res.data.name;
  data.locationForm.parentId = res.data.parent_id;
  data.locationForm.id = res.data.id;
}
// 提交地区修改
const submitLocationModify = async () => {
  const res = await modifyLocationDetail(data.locationForm.id, data.locationForm.name, data.locationForm.collegeId)
  if(res.status === 0){
    ElMessage({
      message: '修改成功',
      type: 'success',
      plain: true,
    })
    // 刷新数据
    searchLocation();
    data.modifyLocationModalVisible = false;
  } else {
    ElMessage({
      message: '修改失败',
      type: 'warning',
      plain: true,
    })
  }
  searchLocation();
}
// 地区分页
const locationSizeChange = (val: any) => {
  searchLocation();
}
const locationCurrentChange = (val: any) => {
  data.locationPage = val;
  searchLocation();
}


// 搜索教学单位
const searchCollege = async () => {
  const res = await getCollegeList(data.inputCollege, data.collegePage, data.collegeCount);
  data.collegeList = res.data.list;
  data.collegeTotal = res.data.total;
}
// 提交教学单位创建
const submitCollegeCreate = async () => {
  data.newCollegeForm.area_id = data.newCollegeForm.area_id;
  const res = await createCollege(data.newCollegeForm);
  if(res.status === 0){
    ElMessage({
      message: '创建成功',
      type: 'success',
      plain: true,
    })
    data.createCollegeModalVisible = false;
  } else {
    ElMessage({
      message: '创建失败',
      type: 'warning',
      plain: true,
    })
  }
  searchCollege();
}
// 删除教学单位
const removeCollege = async (id: number) => {
  const res = await deleteCollege(id);
  if(res.status === 0){
    ElMessage({
      message: '删除成功',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '删除失败',
      type: 'warning',
      plain: true,
    })
  }
  searchCollege();
}
// 修改教学单位
const modityCollegeDetail = async (id: number) => {
  // 打开模态框
  data.modifyCollegeModalVisible = true;
  const res = await getCollegeDetail(id);
  data.collegeForm = res.data;
}
// 提交教学单位修改
const submitCollegeModify = async () => {
  const res = await submitCollegeModifyInfo(data.collegeForm.id, data.collegeForm);
  if(res.status === 0){
    ElMessage({
      message: '修改成功',
      type: 'success',
      plain: true,
    })
    // 刷新数据
    searchLocation();
    data.modifyCollegeModalVisible = false;
  } else {
    ElMessage({
      message: '修改失败',
      type: 'warning',
      plain: true,
    })
  }
  searchCollege();
}
// 教学单位分页
const collegeSizeChange = (val: any) => {
  searchCollege();
}
const collegeCurrentChange = (val: any) => {
  data.collegePage = val;
  searchCollege();
}


// 搜索班级
const searchClass = async () => {
  const res = await getCourseList(data.inputClass, data.classPage, data.classCount);
  data.classList = res.data.list;
  data.classTotal = res.data.total;
}
// 提交新班级创建
const submitClassCreate = async () => {
  // 处理时间
  data.newClassForm.start_time = data.newClassForm.time_range[0];
  data.newClassForm.end_time = data.newClassForm.time_range[1];
  const res = await createClass(data.newClassForm);
  if(res.status === 0){
    ElMessage({
      message: '新班级创建成功',
      type: 'success',
      plain: true,
    })
    data.createClassModalVisible = false;
  } else {
    ElMessage({
      message: '新班级创建失败',
      type: 'warning',
      plain: true,
    })
  }
  searchClass();
}
// 班级修改
const modifyClassDetail = async (id: number) => {
  data.modifyClassModalVisible = true;
  const res = await getClassDetail(id);
  data.currentClass = res.data;
  data.currentClassId = id;
}
// 提交班级信息修改
const submitClassModify = async () => {
  data.currentClass.start_time = data.currentClass.time_range[0];
  data.currentClass.end_time = data.currentClass.time_range[1];
  const res = await modifyClass(data.currentClassId, data.currentClass);
  if(res.status === 0){
    ElMessage({
      message: '班级信息修改成功',
      type: 'success',
      plain: true,
    })
    // 刷新数据
    searchLocation();
    data.modifyClassModalVisible = false;
  } else {
    ElMessage({
      message: '班级信息修改失败',
      type: 'warning',
      plain: true,
    })
  }
  searchClass();
}
// 打开班级申请记录框
const openClassApplyModal = async () => {
  data.classApplyModalVisible = true;
  searchClassApply();
}
// 打开班级创建框
const openCreateClassModal = async () => {
  data.createClassModalVisible = true;
  // 挂载选项数据
  let res = await getCollegeOptions();
  data.collegeOptions = res.data;
  res = await getCourseOptions();
  data.courseOptions = res.data;
  res = await getTeacherOptions();
  data.teacherOptions = res.data;
}
// 班级分页
const classSizeChange = (val: any) => {
  searchClass();
}
const classCurrentChange = (val: any) => {
  data.classPage = val;
  searchClass();
}


// 搜索班级申请记录
const searchClassApply = async () => {
  const res = await getClassApplyList(data.inputClassApply, data.classApplyPage, data.classApplyCount);
  data.classApplyList = res.data.list;
}
// 通过班级申请
const passClassApply = async (id: number) => {
  const res = await evaluateClassApply(id, 2);
    //  输出通过申请成功或失败提示
    if(res.status === 0){
    ElMessage({
      message: '申请已批准',
      type: 'success',
        plain: true,
    })
  } else {
    ElMessage({
      message: '申请批准出现错误',
      type: 'warning',
      plain: true,
    })
  }
  searchClassApply();
}
// 拒绝班级申请
const rejectClassApply = async (id: number) => {
  const res = await evaluateClassApply(id, 3);
  //  输出通过申请成功或失败提示
  if(res.status === 0){
    ElMessage({
      message: '申请已拒绝',
      type: 'success',
        plain: true,
    })
  } else {
    ElMessage({
      message: '申请拒绝出现错误',
      type: 'warning',
      plain: true,
    })
  }
  searchClassApply();
}
// 班级申请记录分页
const classApplySizeChange = (val: any) => {
  searchClassApply();
}
const classApplyCurrentChange = (val: any) => {
  data.classApplyPage = val;
  searchClassApply();
}

// 查看考试安排
const checkExamDetail = async (id: number) => {
  router.push({
    path: "/classExam",
    query: {
      id: id
    }
  })
}

onMounted(async () => {
  // 挂载地区信息
  searchLocation();
  searchCollege();
  searchClass();
  const res = await getLocationOption();
  data.locationOptions = res.data;
})

</script>

<template>
  <div class="education-page">
    <el-tabs v-model="data.activeName" type="border-card" class="education-tabs">
      <!-- 地区管理 -->
      <el-tab-pane label="地区管理" name="first" class="education-pane">
        <div class="search-box">
          <div class="search-title">地区管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputLocation" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入地区名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchLocation()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]"
              @click="data.createLocationModalVisible = true">创建</el-button>
          </div>
        </div>
        <!-- 所有地区信息展示 -->
        <div class="location-list">
          <el-empty v-if="data.locationList.length === 0" description="暂无地区信息"/>
          <el-table v-if="data.locationList.length !== 0" :data="data.locationList" border style="width: 100%">
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="name" label="地区名" />
            <el-table-column prop="parent_name" label="上级地区名" />
            <el-table-column fixed="right" label="操作" min-width="60">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="modityLocationDetail(scope.row.id)">修改</el-button>
                <el-button link type="primary" size="small" @click="removeLocation(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-if="data.locationList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.locationTotal" 
            :page-size="data.locationCount"
            @size-change="locationSizeChange"
            @current-change="locationCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>
      <!-- 教学单位管理 -->
      <el-tab-pane label="教学单位" name="second">
        <div class="search-box">
          <div class="search-title">教学单位管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputCollege" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入教学单位名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchCollege()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="data.createCollegeModalVisible = true">创建</el-button>
          </div>
        </div>
        <!-- 所有教学单位信息展示 -->
        <div class="college-list">
          <el-empty v-if="data.collegeList.length === 0" description="暂无教学单位信息"/>
          <el-table v-if="data.collegeList.length !== 0" :data="data.collegeList" border style="width: 100%">
            <el-table-column prop="id" label="ID" />
            <el-table-column prop="name" label="教学单位名" />
            <el-table-column prop="area_name" label="所属地区名" />
            <el-table-column fixed="right" label="操作" min-width="60">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="modityCollegeDetail(scope.row.id)">修改</el-button>
                <el-button link type="primary" size="small" @click="removeCollege(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-if="data.collegeList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.collegeTotal" 
            :page-size="data.collegeCount"
            @size-change="collegeSizeChange"
            @current-change="collegeCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>
      <!-- 班级管理 -->
      <el-tab-pane label="班级管理" name="third">
        <div class="search-box">
          <div class="search-title">班级管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputClass" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入班级名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchClass()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="openCreateClassModal()">创建班级</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="openClassApplyModal()">班级申请记录</el-button>
          </div>
        </div>
        <!-- 所有班级信息展示 -->
        <div class="college-list">
          <el-empty v-if="data.classList.length === 0" description="暂无班级信息"/>
          <el-table v-if="data.classList.length !== 0" :data="data.classList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="60"/>
            <el-table-column prop="name" label="班级名" width="120"/>
            <el-table-column prop="teacher_name" label="教师名" width="120"/>
            <el-table-column prop="course_name" label="课程名" width="150"/>
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
            <el-table-column prop="college_name" label="地区名" />
            <el-table-column fixed="right" label="操作" min-width="120">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="modifyClassDetail(scope.row.id)">班级修改</el-button>
                <el-button link type="primary" size="small" @click="checkExamDetail(scope.row.id)">考试安排</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-if="data.classList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.classTotal" 
            :page-size="data.classCount"
            @size-change="classSizeChange"
            @current-change="classCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- 创建地区框 -->
  <el-dialog v-model="data.createLocationModalVisible" title="地区创建" width="400" center>
    <div class="education-dialog">
      <el-form :model="data.newLocationForm" class="w-[20rem]">
        <!-- 地区 -->
        <el-form-item>
          <el-input v-model="data.newLocationForm.name" placeholder="请输入地区名称" />
        </el-form-item>
        <!-- 上级地区 -->
        <el-form-item>
          <el-cascader v-model="data.newLocationForm.parent_id" :options="data.locationOptions" :props="{ checkStrictly: true }" style="width:100%" clearable placeholder="请选择上级地区" />
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="w-[20rem]" type="primary" @click="submitLocationCreate()">提交创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 修改地区框 -->
  <el-dialog v-model="data.modifyLocationModalVisible" title="地区修改" width="400" center>
    <div class="education-dialog">
      <el-form :model="data.locationForm" class="w-[20rem]">
        <!-- 地区 -->
        <el-form-item>
          <el-input v-model="data.locationForm.name" placeholder="请输入地区名称" />
        </el-form-item>
        <!-- 上级地区 -->
        <el-form-item>
          <el-cascader v-model="data.locationForm.parentId" :options="data.locationOptions" :props="{ checkStrictly: true }" style="width:100%" clearable disabled placeholder="无" />
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="w-[20rem]" type="primary" @click="submitLocationModify()">提交修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 创建教学单位框 -->
  <el-dialog v-model="data.createCollegeModalVisible" title="教学单位创建" width="400" center>
    <div class="education-dialog">
      <el-form :model="data.newCollegeForm" class="w-[20rem]">
        <!-- 地区 -->
        <el-form-item>
          <el-input v-model="data.newCollegeForm.name" placeholder="请输入教学单位名称" />
        </el-form-item>
        <!-- 上级地区 -->
        <el-form-item>
          <el-cascader v-model="data.newCollegeForm.area_id" :options="data.locationOptions" style="width:100%" clearable placeholder="请选择所属地区" />
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button type="primary" class="w-[20rem]" @click="submitCollegeCreate()">提交创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 修改教学单位框 -->
  <el-dialog v-model="data.modifyCollegeModalVisible" title="教学单位修改" width="400" center>
    <div class="education-dialog">
      <el-form :model="data.collegeForm" class="w-[20rem]">
        <!-- 地区 -->
        <el-form-item>
          <el-input v-model="data.collegeForm.name" placeholder="请输入教学单位名称" />
        </el-form-item>
        <!-- 上级地区 -->
        <el-form-item>
          <el-cascader v-model="data.collegeForm.area_id" :options="data.locationOptions" style="width:100%" disabled clearable placeholder="无" />
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="w-[20rem]" type="primary" @click="submitCollegeModify()">提交修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 创建班级框 -->
  <el-dialog v-model="data.createClassModalVisible" title="班级创建" width="600" center>
    <div class="education-dialog">
      <el-form :model="data.newClassForm" class="w-[30rem]">
        <!-- 班级名 -->
        <el-form-item>
          <el-input v-model="data.newClassForm.name" placeholder="请输入班级名称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <OfficeBuilding />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 教师ID -->
        <el-form-item>
          <el-select v-model="data.newClassForm.teacher_id" placeholder="请选择教师">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.teacherOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 课程 -->
        <el-form-item>
          <el-select v-model="data.newClassForm.course_id" placeholder="请选择课程">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Notebook />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.courseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 容量 -->
        <el-form-item>
          <el-input-number class="w-[30rem]" v-model="data.newClassForm.capacity" :min="1" :max="100">
            <template #prefix>
              <span>课程容量</span>
            </template>
            <template #suffix>
              <span>人</span>
            </template>
          </el-input-number>
        </el-form-item>
        <!-- 起止时间 -->
        <el-form-item>
          <el-date-picker
            v-model="data.newClassForm.time_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <!-- 描述 -->
        <el-form-item>
          <el-input v-model="data.newClassForm.desc" placeholder="请输入课程描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 教学单位 -->
        <el-form-item>
          <el-select v-model="data.newClassForm.college_id" placeholder="请选择教学单位">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Location />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.collegeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button type="primary" class="w-[40rem]" @click="submitClassCreate()">创建新班级</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 修改班级框 -->
  <el-dialog v-model="data.modifyClassModalVisible" title="班级修改" width="600" center>
    <div class="education-dialog">
      <el-form :model="data.currentClass" class="w-[30rem]">
        <!-- 班级名 -->
        <el-form-item>
          <el-input v-model="data.currentClass.name" placeholder="请输入班级名称">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <OfficeBuilding />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 教师ID -->
        <el-form-item>
          <el-select v-model="data.currentClass.teacher_id" placeholder="请选择教师">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.teacherOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 课程 -->
        <el-form-item>
          <el-select v-model="data.currentClass.course_id" placeholder="请选择课程">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Notebook />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.courseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 容量 -->
        <el-form-item>
          <el-input-number class="w-[30rem]" v-model="data.currentClass.capacity" :min="1" :max="100">
            <template #prefix>
              <span>课程容量</span>
            </template>
            <template #suffix>
              <span>人</span>
            </template>
          </el-input-number>
        </el-form-item>
        <!-- 起止时间 -->
        <el-form-item>
          <el-date-picker
            v-model="data.currentClass.time_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <!-- 描述 -->
        <el-form-item>
          <el-input v-model="data.currentClass.desc" placeholder="请输入课程描述">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 教学单位 -->
        <el-form-item>
          <el-select v-model="data.currentClass.college_id" placeholder="请选择教学单位">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Location />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.collegeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button type="primary" class="w-[40rem]" @click="submitClassModify()">修改班级信息</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 班级申请记录框 -->
  <el-dialog v-model="data.classApplyModalVisible" title="班级申请记录" width="1200" center>
    <div class="education-dialog">
      <div class="dialog-search-box">
        <div class="search-title">班级申请记录</div>
        <div class="select-exam">
          <!-- 搜索 -->
          <el-input v-model="data.inputClassApply" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入班级名称" />
          <el-button type="primary" class="mr-3 h-[2rem]" @click="searchClassApply()">搜索</el-button>
        </div>
      </div>
      <!-- 所有班级信息展示 -->
      <div class="dialog-list">
        <el-empty v-if="data.classApplyList.length === 0" description="暂无班级申请信息"/>
        <el-table v-if="data.classApplyList.length !== 0" :data="data.classApplyList" border style="width: 100%">
          <el-table-column prop="user_id_number" label="用户ID"/>
          <el-table-column prop="user_name" label="用户名" />
          <el-table-column prop="class_name" label="班级名"/>
          <el-table-column prop="create_time" label="创建时间"/>
          <el-table-column prop="status_desc" label="审核状态" />
          <el-table-column fixed="right" label="操作" min-width="120">
            <template v-slot="scope">
              <el-button v-if="scope.row.status === 1" link type="primary" size="small" @click="passClassApply(scope.row.id)">通过</el-button>
              <el-button v-if="scope.row.status === 1" link type="primary" size="small" @click="rejectClassApply(scope.row.id)">不通过</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          v-if="data.classApplyList.length !== 0"
          background 
          layout="prev, pager, next"
          :total="data.classApplyTotal" 
          :page-size="data.classApplyCount"
          @size-change="classApplySizeChange"
          @current-change="classApplyCurrentChange"
          class="mt-4 mx-auto"
        />
      </div>
    </div>
  </el-dialog>
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
.location-list {
  @apply flex flex-col mt-4 mr-2;
}
.college-list {
  @apply flex flex-col mt-4 mr-2;
}
/* 模态框 */
.education-dialog {
  @apply flex items-center justify-center flex-col;
}
.dialog-search-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md;
}
.dialog-list {
  width: 100%;
  @apply flex flex-col mt-4;
}
</style>
