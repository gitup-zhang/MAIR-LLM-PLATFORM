<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, Edit, Filter } from '@element-plus/icons-vue'
import { getImageList, getImageInfo, createImage, buildImage, deleteImage, getImageDetail } from '@/apis/image'
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
  imageList: [] as any,
  containerList: [],
  // 新表单
  newImageForm: {
    image_id: 0 || '',
    desc: '',
    container_id: '',
    name: ''
  },
  // 容器地址
  containerAddr: '',
  // 模态框
  modifyImageModalVisible: false,
  createImageModalVisible: false,
  // 选项
  imageOptions: [],
  imagePage: 1,
  imageCount: 6,
  imageTotal: 0,
  containerPage: 1,
  containerCount: 6,
  containerTotal: 0,
  page: 1,
  count: 6,
  total: 0
})

// 搜索镜像
const searchImage = async () => {
  const res = await getImageList(data.inputImage, data.imagePage, data.imageCount);
  data.imageList = res.data.list;
  data.imageTotal = res.data.total;
  console.log(res);
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
// 查看镜像
const checkImageDetail = async (index: number) => {
  const res = await getImageDetail(data.imageList[index]['id']);
  if(res.status === 0){
    ElMessage({
      message: '正在跳转到容器内',
      type: 'success',
      plain: true,
    })
    window.open(res.data.addr);
  } else {
    ElMessage({
      message: '查看镜像失败',
      type: 'warning',
      plain: true,
    })
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


// 搜索容器
const searchContainer = async () => {
  const res = await getContainerList(data.inputContainer, data.containerPage, data.containerCount);
  data.containerList = res.data.list;
  data.containerTotal = res.data.total;
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
  console.log(res);
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
  console.log(res);
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
// 容器分页
const containerSizeChange = (val: any) => {
  searchContainer();
}
const containerCurrentChange = (val: any) => {
  data.containerPage = val;
  searchContainer();
}

onMounted(() => {
  // 挂载数据
  searchImage();
  searchContainer();
})
</script>

<template>
  <div class="experiment-page">
    <el-tabs v-model="data.activeName" type="border-card" class="education-tabs" @tab-click="handleClick">
      <el-tab-pane label="镜像管理" name="first" class="education-pane">
        <div class="search-box">
          <div class="search-title">镜像管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputImage" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入镜像名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchImage()">搜索</el-button>
            <!-- <el-button type="primary" class="mr-3 h-[2rem]" @click="addImage(-1)">创建新镜像</el-button> -->
          </div>
        </div>
        <!-- 所有镜像信息展示 -->
        <div class="show-list">
          <el-empty v-if="data.imageList.length === 0" description="暂无镜像信息"/>
          <el-table v-if="data.imageList.length !== 0" :data="data.imageList" border style="width: 100%">
            <el-table-column prop="name" label="镜像名"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="type_name" label="镜像类型"/>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="checkImageDetail(scope.$index)">查看镜像</el-button>
                <!-- <el-button link type="primary" size="small" @click="addImage(scope.$index)">创建镜像</el-button> -->
                <el-button v-if="scope.row.type === 1" link type="primary" size="small" @click="updateImage(scope.$index)">创建镜像与容器</el-button>
                <el-button v-if="scope.row.type === 1" link type="primary" size="small" @click="removeImage(scope.$index)">删除镜像</el-button>
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
          <el-empty v-if="data.containerList.length === 0" description="暂无容器信息"/>
          <el-table v-if="data.containerList.length !== 0" :data="data.containerList" border style="width: 100%" max-height="400">
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
          <!-- 分页 -->
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
      </el-tab-pane>
    </el-tabs>
  </div>

    <!-- 创建镜像框 -->
    <el-dialog v-model="data.createImageModalVisible" title="创建镜像" width="600" center>
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
          <el-input 
            v-model="data.newImageForm.name" 
            placeholder="请输入镜像名称(不能超过20个字)"
            show-word-limit="true"
            maxlength="20"
          >
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
          <el-input 
            v-model="data.newImageForm.desc" 
            placeholder="请输入镜像描述(不能超过500个字)"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            maxlength="500"
            show-word-limit="true"
          >
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
          <el-input 
            v-model="data.newImageForm.name"
            placeholder="请输入镜像名称(不能超过20个字)"
            show-word-limit="true"
            maxlength="20"
          >
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
          <el-input 
            v-model="data.newImageForm.desc" 
            placeholder="请输入镜像描述(不能超过500个字)"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            maxlength="500"
            show-word-limit="true"
          >
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

</template>

<style scoped>
/* 整体页面设置 */
.experiment-page {
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
.admin-class-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
