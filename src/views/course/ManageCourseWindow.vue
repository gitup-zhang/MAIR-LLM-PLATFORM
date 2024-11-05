<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { getChapterList } from '@/apis/chapter';
import { getCourseInfoList } from '@/apis/course';

const data = reactive({
  activeName: 'first',
  // 章节名称输入
  inputChapter: '',
  inputCourse: '',
  // 列表
  chapterList: [],
  courseList: [],
  page: 1,
  count: 10,
  total: 0
})

// 搜索章节
const searchChapter = async () => {
  const res = await getChapterList(data.inputChapter, data.page, data.count);
  data.chapterList = res.data.list;
}
// 搜索课程
const searchCourse = async () => {
  const res = await getCourseInfoList(data.inputCourse, data.page, data.count);
  data.courseList = res.data.list;
}

onMounted(() => {
  // 挂载数据
  searchChapter();
  searchCourse();
})
</script>

<template>
  <div class="course-page">
    <el-tabs v-model="data.activeName" type="border-card" class="course-tabs" @tab-click="handleClick">
      <el-tab-pane label="章节管理" name="first" class="course-pane">
        <div class="search-box">
          <div class="search-title">章节管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputChapter" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入章节名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchChapter()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="">创建</el-button>
          </div>
        </div>
        <!-- 所有章节信息展示 -->
        <div class="show-list">
          <el-table :data="data.chapterList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="name" label="章节名"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="use_time" label="课时"/>
            <el-table-column prop="image_name" label="镜像"/>
            <el-table-column label="文件">
              <template v-slot="scope">
                {{ scope.row.files_info[0].name }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="课程管理" name="second">
        <div class="search-box">
          <div class="search-title">课程管理</div>
          <div class="select-exam">
            <!-- 搜索 -->
            <el-input v-model="data.inputCourse" class="mr-3 w-[30vw] h-[2rem]" placeholder="请输入课程名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchCourse()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="">创建</el-button>
          </div>
        </div>
        <!-- 所有课程信息展示 -->
        <div class="show-list">
          <el-table :data="data.chapterList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="name" label="课程名"/>
            <el-table-column prop="desc" label="描述"/>
            <el-table-column prop="use_time" label="总学时"/>
            <el-table-column fixed="right" label="操作">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="">修改</el-button>
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
</style>
