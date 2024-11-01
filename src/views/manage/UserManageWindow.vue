<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { getUserList, getTeacherList } from '@/apis/user'

const data = reactive({
  userList: [],
  teacherList: [],
  searchUserId: '',
  searchUserName: '',
  searchApplyUserId: '',
  userApplyModalVisible: false,
  page: 1,
  count: 10,
  total: 0
})

// 搜索用户列表
const searchUserList = async () => {
  const res = await getUserList(data.searchUserName, data.searchUserId, data.page, data.count);
  data.userList = res.data.list;
}
// 搜索教师列表
const searchTeacherList = async () => {
    const res = await getTeacherList(data.searchUserName, data.searchUserId, data.page, data.count);
    data.teacherList = res.data.list;
}
// 打开用户角色申请模态框
const searchUserApplyList = () => {
  data.userApplyModalVisible = true;
}

const getUserApplyListDetail = () => {

}

onMounted(() => {
  // 挂载用户信息
  searchUserList();
  // 挂载教师信息
  searchTeacherList();
})
</script>

<template>
  <div class="manage-page">
    <div class="manage-main">
      <!-- 检索用户 -->
      <div class="manage-box">
        <div class="manage-title">用户管理</div>
        <div class="select-user">
          <!-- 搜索 -->
          <el-input v-model="data.searchUserId" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入学号" />
          <el-input v-model="data.searchUserName" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入用户名" />
          <el-button type="primary" class="mr-3 h-[2rem]" @click="searchUserList()">搜索</el-button>
          <el-button type="primary" class="mr-3 h-[2rem]" @click="searchUserApplyList()">角色申请记录</el-button>
        </div>
      </div>

      <!-- 所有用户信息展示 -->
      <div>用户信息</div>
      <div class="user-list">
        <el-table :data="data.userList" border style="width: 100%">
          <el-table-column prop="id_number" label="学号"/>
          <el-table-column prop="name" label="昵称"/>
          <el-table-column prop="phone" label="电话号码"/>
          <el-table-column prop="email" label="邮箱"/>
          <el-table-column prop="area_name" label="所属地区"/>
          <!-- 右侧固定列 展示详情信息 -->
          <el-table-column fixed="right" label="操作" min-width="60">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
      </div>

      <!-- 所有教师信息展示 -->
      <div class="user-list">
        <el-table :data="data.teacherList" border style="width: 100%">
          <el-table-column prop="id_number" label="学号"/>
          <el-table-column prop="name" label="昵称"/>
          <el-table-column prop="phone" label="电话号码"/>
          <el-table-column prop="email" label="邮箱"/>
          <el-table-column prop="area_name" label="所属地区"/>
          <!-- 右侧固定列 展示详情信息 -->
          <el-table-column fixed="right" label="操作" min-width="60">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
      </div>

    </div>
  </div>

  <!-- 用户角色申请记录 -->
  <el-dialog v-model="data.userApplyModalVisible" title="角色申请记录" width="800">
    <div class="select-user">
      <!-- 搜索 -->
      <el-input v-model="data.searchApplyUserId" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入用户ID" />
      <el-button type="primary" class="mr-3 h-[2rem]" @click="getUserApplyListDetail()">搜索</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.manage-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.manage-main {
  position: relative;
  @apply flex flex-col;
}
.manage-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md;
}
.manage-main {
  position: relative;
  @apply flex flex-col;
}
.manage-title {
  position: absolute;
  left: 2rem;
  @apply text-2xl italic font-semibold text-light-50;
}
.user-list {
  @apply flex flex-col mt-4 mr-2;
}
</style>
