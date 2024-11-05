<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { User, Star, Message, Iphone, Aim, Location, House, Lock } from '@element-plus/icons-vue'
import { getUserList, getTeacherList } from '@/apis/user'
import { getRoleApplyList } from '@/apis/role'
const data = reactive({
  activeName: 'first',
  inputUserId: '',
  inputUserName: '',
  inputTeacherId: '',
  inputTeacherName: '',
  inputRoleApllyId: '',
  userList: [],
  teacherList: [],
  roleApplyList: [],
  // 创建
  newUserForm: {
    name: '',
    email: '',
    phone: '',
    type: 1,
    user_name: '',
    area_id: 0,
    idcard: '',
    password: '',
    checkPass: ''
  },
  // 模态框
  createUserModalVisible: false,
  page: 1,
  count: 10,
  total: 0
})

// 搜索用户列表
const searchUser = async () => {
  const res = await getUserList(data.inputUserName, data.inputUserId, data.page, data.count);
  console.log(res)
  data.userList = res.data.list;
}
// 搜索教师列表
const searchTeacher = async () => {
  const res = await getTeacherList(data.inputTeacherName, data.inputTeacherId, data.page, data.count);
  data.teacherList = res.data.list;
}
// 搜索申请列表
const searchApplyList = async () => {
  const res = await getRoleApplyList(data.inputRoleApllyId, data.page, data.count);
  data.roleApplyList = res.data.list;
}

onMounted(() => {
  // 挂载信息
  searchUser();
  searchTeacher();
  searchApplyList();
})
</script>

<template>
  <div class="manage-page">
    <el-tabs v-model="data.activeName" type="border-card" class="user-tabs" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <!-- 检索用户 -->
        <div class="manage-box">
          <div class="manage-title">用户管理</div>
          <div class="select-user">
            <!-- 搜索 -->
            <el-input v-model="data.inputUserId" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入学号" />
            <el-input v-model="data.inputUserName" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入用户名" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchUser()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="data.createUserModalVisible = true">创建</el-button>
          </div>
        </div>
        <!-- 用户信息展示 -->
        <div class="user-list">
          <el-table :data="data.userList" border style="width: 100%">
            <el-table-column prop="id_number" label="学号"/>
            <el-table-column prop="name" label="昵称"/>
            <el-table-column prop="phone" label="电话号码"/>
            <el-table-column prop="email" label="邮箱"/>
            <el-table-column prop="area_name" label="所属地区"/>
            <el-table-column fixed="right" label="操作" min-width="60">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="教师管理" name="second">
        <!-- 检索用户 -->
        <div class="manage-box">
          <div class="manage-title">教师管理</div>
          <div class="select-user">
            <!-- 搜索 -->
            <el-input v-model="data.inputTeacherId" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入教师ID" />
            <el-input v-model="data.inputTeacherName" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入教师名称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchTeacher()">搜索</el-button>
          </div>
        </div>
        <!-- 用户信息展示 -->
        <div class="user-list">
          <el-table :data="data.teacherList" border style="width: 100%">
            <el-table-column prop="id_number" label="ID"/>
            <el-table-column prop="name" label="昵称"/>
            <el-table-column prop="phone" label="电话号码"/>
            <el-table-column prop="email" label="邮箱"/>
            <el-table-column prop="area_name" label="所属地区"/>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="角色申请管理" name="third">
        <!-- 检索用户 -->
        <div class="manage-box">
          <div class="manage-title">角色申请管理</div>
          <div class="select-user">
            <!-- 搜索 -->
            <el-input v-model="data.inputRoleApllyId" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入ID号" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchApplyList()">搜索</el-button>
          </div>
        </div>
        <!-- 用户信息展示 -->
        <div class="user-list">
          <el-table :data="data.roleApplyList" border style="width: 100%">
            <el-table-column prop="user_id_number" label="用户ID"/>
            <el-table-column prop="user_name" label="用户名"/>
            <el-table-column prop="new_type_desc" label="申请角色"/>
            <el-table-column prop="create_time" label="时间"/>
            <el-table-column prop="status_desc" label="审核状态"/>
            <el-table-column fixed="right" label="操作" min-width="60">
              <template v-slot="scope">
                <el-button v-if="scope.row.status === 1" link type="primary" size="small" @click="">通过</el-button>
                <el-button v-if="scope.row.status === 1" link type="primary" size="small" @click="">不通过</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination background layout="prev, pager, next" :total="1" class="mt-4 mx-auto"/>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- 创建用户框 -->
  <el-dialog v-model="data.createUserModalVisible" title="创建新用户" width="400">
    <div class="edit-dialog">
      <el-form :model="data.newUserForm" class="w-[20rem]">
        
        <!-- 昵称 -->
        <el-form-item>
          <el-input v-model="data.newUserForm.name" placeholder="请输入昵称">
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

      </el-form>
    </div>
  </el-dialog>

</template>

<style scoped>
/* 整体页面设置 */
.manage-page {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-1 rounded-md;
}
.user-tabs {
  height: 100%;
  width: 100%;
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
