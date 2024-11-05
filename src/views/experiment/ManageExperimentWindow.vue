<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { getImageList } from '@/apis/image'
import { getContainerList } from '@/apis/container';

const data = reactive({
  activeName: 'first',
  inputImage: '',
  inputContainer: '',
  imageList: [],
  containerList: [],
  page: 1,
  count: 10,
  total: 0
})

// 搜索镜像
const searchImage = async () => {
  const res = await getImageList(data.inputImage, data.page, data.count);
  data.imageList = res.data.list;
}
// 搜索容器
const searchContainer = async () => {
  const res = await getContainerList(data.inputContainer, data.page, data.count);
  data.containerList = res.data.list;
}

onMounted(() => {
  // 挂载数据
  searchImage();
  searchContainer();
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
            <el-button type="primary" class="mr-3 h-[2rem]" @click="">创建普通镜像</el-button>
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
                <el-button v-if="scope.row.status != 'delete' && scope.row.status != 'exited'" link type="primary" size="small" @click="">进入容器</el-button>
                <el-button v-if="scope.row.status != 'delete' && scope.row.status != 'exited'" link type="primary" size="small" @click="">停止容器</el-button>
                <el-button v-if="scope.row.status != 'delete' && scope.row.status == 'exited'" link type="primary" size="small" @click="">启动容器</el-button>
                <el-button v-if="scope.row.status != 'delete'" link type="primary" size="small" @click="">删除容器</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>
  </el-tabs>

  </div>

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
</style>
