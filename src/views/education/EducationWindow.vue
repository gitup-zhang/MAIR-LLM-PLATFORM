<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus'
import { getLocationList, deleteLocation, getLocationDetail, modifyLocationDetail, createLocation } from '@/apis/location'

const data = reactive({
  activeName: 'first',
  // 输入框
  inputLocation: '',
  inputEducation: '',
  // 模态框
  modifyLocationModalVisible: false,
  createLocationModalVisible: false,
  // 表单
  locationForm: {
    id: 0,
    name: '',
    collegeId: 0
  },
  // 创建表单
  newLocationForm: {
    name: '',
    parent_id: 0
  },
  inputClss: '',
  locationList: [],
  page: 1,
  count: 10,
  total: 0
})

// 搜索地区
const searchLocation = async () => {
  const res = await getLocationList(data.inputLocation, data.page, data.count)
  data.locationList = res.data.list
}

// 提交创建
const submitLocationCreate = async () => {
  data.newLocationForm.parent_id = Number(data.newLocationForm.parent_id);
  const res = await createLocation(data.newLocationForm)
  if(res.status === 0){
    ElMessage({
      message: '创建成功',
      type: 'success',
      plain: true,
    })
    // 刷新数据
    searchLocation();
    data.createLocationModalVisible = false;
  } else {
    ElMessage({
      message: '创建失败',
      type: 'warning',
      plain: true,
    })
  }
  searchLocation();
}

// 取消创建
const cancelLocationCreate = () => {
  data.createLocationModalVisible = false;
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
  data.locationForm.collegeId = res.data.parent_id;
  data.locationForm.id = res.data.id;
}

// 取消地区修改
const modifyLocationCancel = () => {
    data.modifyLocationModalVisible = false;
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

onMounted(() => {
  // 挂载地区信息
  searchLocation();

})

</script>

<template>
  <div class="education-page">
    <el-tabs v-model="data.activeName" class="education-tabs" @tab-click="handleClick">
      <el-tab-pane label="地区管理" name="first" class="education-pane">
        <div class="search-box">
          <div class="search-title">地区管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputLocation" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入地区名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchLocation()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="data.createLocationModalVisible = true">创建</el-button>
          </div>
        </div>

        <!-- 所有地区信息展示 -->
        <div class="location-list">
          <el-table :data="data.locationList" border style="width: 100%">
            <el-table-column prop="id" label="ID"/>
            <el-table-column prop="name" label="地区名"/>
            <el-table-column prop="parent_name" label="上级地区名"/>
            <el-table-column fixed="right" label="操作" min-width="60">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="modityLocationDetail(scope.row.id)">修改</el-button>
                <el-button link type="primary" size="small" @click="removeLocation(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
        </div>


      </el-tab-pane>

    <el-tab-pane label="教学单位" name="second">
      <div class="search-box">
          <div class="search-title">教学单位管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputEducation" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入教学单位名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExam()">搜索</el-button>
          </div>
        </div>
    </el-tab-pane>

    <el-tab-pane label="班级管理" name="third">
      <div class="search-box">
        <div class="search-title">班级管理</div>
        <div class="select-exam">
          <!-- 搜索 -->
          <el-input v-model="data.inputClss" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入班级名称" />
          <el-button type="primary" class="mr-3 h-[2rem]" @click="searchExam()">搜索</el-button>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>

  </div>

  <!-- 修改地区框 -->
  <el-dialog v-model="data.modifyLocationModalVisible" title="地区修改" width="400">
    <el-form :model="data.locationForm" class="w-[20rem]">
        <!-- 地区 -->
        <el-form-item>
          <el-input v-model="data.locationForm.name" placeholder="请输入地区名称"/>
        </el-form-item>
        <!-- 上级地区 -->
        <el-form-item>
          <el-input v-model="data.locationForm.collegeId" placeholder="请输入上级地区" disabled />
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="w-[5rem]" type="primary" @click="submitLocationModify()">提交修改</el-button>
          <el-button class="w-[5rem]" type="primary" @click="modifyLocationCancel()">取消修改</el-button>
        </el-form-item>
      </el-form>
  </el-dialog>

    <!-- 创建地区框 -->
    <el-dialog v-model="data.createLocationModalVisible" title="地区创建" width="400">
      <el-form :model="data.newLocationForm" class="w-[20rem]">
        <!-- 地区 -->
        <el-form-item>
          <el-input v-model="data.newLocationForm.name" placeholder="请输入地区名称"/>
        </el-form-item>
        <!-- 上级地区 -->
        <el-form-item>
          <el-input v-model="data.newLocationForm.parent_id" placeholder="请输入上级地区"/>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="w-[5rem]" type="primary" @click="submitLocationCreate()">提交创建</el-button>
          <el-button class="w-[5rem]" type="primary" @click="cancelLocationCreate()">取消创建</el-button>
        </el-form-item>
      </el-form>
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
</style>
