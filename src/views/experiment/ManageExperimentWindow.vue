<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getImageList, getImageInfo } from '@/apis/image'
import { getContainerList, stopContainer, startContainer, deleteContainer } from '@/apis/container';

const data = reactive({
  activeName: 'first',
  inputImage: '',
  inputContainer: '',
  // 信息
  imageInfo: {
    image_id: 0,
    desc: '',
    container_id: '',
    name: ''
  },
  myImageList: [],
  imageList: [],
  containerList: [],
  // 新表单
  newImageForm: {
    image_id: 0,
    desc: '',
    container_id: '',
    name: ''
  },
  // 模态框
  createImageModalVisible: false,
  // 选项
  imageOptions: [],
  page: 1,
  count: 10,
  total: 0
})

// 搜索镜像
const searchImage = async () => {
  const res = await getImageList(data.inputImage, data.page, data.count);
  data.imageList = res.data.list;
}
// 打开创建镜像模态框
const openImageCreateModal = async () => {
  data.createImageModalVisible = true;
  sessionStorage.image_id = -1;
}
// 创建镜像
const submitImageCreate = async () => {
  
}

const getData = async () => {
  var tmp = {
    'name': '',
    'id': ''
  };
  if(sessionStorage.image_id === '-1') {
    const res = await getImageInfo();
    data.myImageList = res.data.base_image_list;
    data.imageInfo.image_id = data.myImageList[0]['id'];

  } else if (sessionStorage.image_name !== sessionStorage.flag_name) {
    tmp = {
      'name': '',
    'id': ''
    }
    tmp['name'] = sessionStorage.image_name;
    tmp['id'] = sessionStorage.image_id;
    data.imageList.push(tmp)
  }
}

// 搜索容器
const searchContainer = async () => {
  const res = await getContainerList(data.inputContainer, data.page, data.count);
  data.containerList = res.data.list;
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
      type: 'warning',
      plain: true,
    })
  }
  searchContainer();
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
      type: 'warning',
      plain: true,
    })
  }
  searchContainer();
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
      type: 'warning',
      plain: true,
    })
  }
  searchContainer();

}
// 进入容器
const enterContainer = async (address: string) => {
  window.open(address)
} 

onMounted(() => {
  // 挂载数据
  searchImage();
  searchContainer();
  // 初始化数据
  getData();
})
</script>

<template>
  <div class="education-page">
    <el-tabs v-model="data.activeName" type="border-card" class="education-tabs" @tab-click="handleClick">
      <el-tab-pane label="镜像管理" name="first" class="education-pane">
        <div class="search-box">
          <div class="search-title">镜像管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputImage" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入镜像名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchImage()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="openImageCreateModal()">创建普通镜像</el-button>
          </div>
        </div>
        <!-- 所有镜像信息展示 -->
        <div class="show-list">
          <el-table :data="data.imageList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="name" label="镜像名"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="type_name" label="镜像类型"/>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="">查看镜像</el-button>
                <el-button link type="primary" size="small" @click="">创建镜像</el-button>
                <el-button v-if="scope.row.type === 1" link type="primary" size="small" @click="">修改镜像</el-button>
                <el-button v-if="scope.row.type === 2" link type="primary" size="small" @click="">删除镜像</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="容器管理" name="second">
        <div class="search-box">
          <div class="search-title">容器管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputContainer" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入容器名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchContainer()">搜索</el-button>
          </div>
        </div>
        <!-- 所有容器信息展示 -->
        <div class="show-list">
          <el-table :data="data.containerList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="user_id_number" label="学号"/>
            <el-table-column prop="user_name" label="用户"/>
            <el-table-column prop="class_name" label="班级"/>
            <el-table-column prop="subcourse_name" label="章节"/>
            <el-table-column prop="image_name" label="镜像"/>
            <el-table-column prop="status" label="状态"/>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button v-if="scope.row.status != 'delete' && scope.row.status != 'exited'" link type="primary" size="small" @click="enterContainer(scope.row.addr)">进入容器</el-button>
                <el-button v-if="scope.row.status != 'delete' && scope.row.status != 'exited'" link type="primary" size="small" @click="ceaseContainer(scope.row.id)">停止容器</el-button>
                <el-button v-if="scope.row.status != 'delete' && scope.row.status == 'exited'" link type="primary" size="small" @click="launchContainer(scope.row.id)">启动容器</el-button>
                <el-button v-if="scope.row.status != 'delete'" link type="primary" size="small" @click="removeContainer(scope.row.id)">删除容器</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>
  </el-tabs>

  </div>

  <!-- 创建镜像框 -->
  <el-dialog v-model="data.createImageModalVisible" title="创建镜像" width="600">
    <div class="image-dialog">
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
              v-for="item in data.typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
                <Document />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-[30rem]" type="primary" @click="submitImageCreate()">创建新镜像</el-button>
        </el-form-item>
      </el-form>
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
.show-list {
  @apply flex flex-col mt-4 mr-2;
}
.image-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
