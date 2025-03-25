<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus'
import { User, Star, Message, Iphone, Aim, Location, House, Lock, Postcard } from '@element-plus/icons-vue'
import { getUserList, getTeacherList, createUser, getUserDetail, editUserInfo } from '@/apis/user'
import { getAllRoleApplyList, evaluateRoleApply } from '@/apis/role'
import { getLocationOption } from '@/apis/location';

const data = reactive({
  activeName: 'first',
  // 输入
  inputUserId: '',
  inputUserName: '',
  inputTeacherId: '',
  inputTeacherName: '',
  inputRoleApllyId: '',
  // 列表
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
  modifyUserModalVisible: false,
  // 当前用户ID
  currentUserId: 0,
  // 当前用户
  currentUserForm: {
    name: '',
    email: '',
    phone: '',
    type: 1,
    user_name: '',
    area_id: 4,
    idcard: '',
    id_number: ''
  },
  userPage: 1,
  userCount: 6,
  userTotal: 0,
  teacherPage: 1,
  teacherCount: 6,
  teacherTotal: 0,
  applyPage: 1,
  applyCount: 6,
  applyTotal: 0,
  locationOptions: [],
  userRoleOptions: [
    {
      value: 1,
      label: '学生',
      disabled: false
    },
    {
      value: 2,
      label: '教师',
      disabled: true
    }, 
    {
      value: 3,
      label: '教务',
      disabled: true
    }
  ]
})

// 搜索用户列表
const searchUser = async () => {
  if(data.inputUserName.length > 0 || data.inputUserId.length > 0){
    data.userPage = 1;
  }
  const res = await getUserList(data.inputUserName, data.inputUserId, data.userPage, data.userCount);
  data.userList = res.data.list;
  data.userTotal = res.data.total;
}
// 用户分页
const userSizeChange = (val: any) => {
  searchUser();
}
const userCurrentChange = (val: any) => {
  data.userPage = val;
  searchUser();
}

// 打开创建用户模态框
const openCreateUserModal = async () => {
  // 刷新地区选项列表
  const locationOptionsRes = await getLocationOption();
  data.locationOptions = locationOptionsRes.data;
  data.createUserModalVisible = true;
}

// 创建用户
const createNewUser = async () => {
  // 检查非空
  if(data.newUserForm.password === '' || data.newUserForm.checkPass === ''){
    ElMessage({
      message: '请输入密码',
      type: 'warning',
      plain: true,
    })
  }else if(!validatePassword(data.newUserForm.password ) || !validatePassword(data.newUserForm.checkPass)){
    // 检查类型
    ElMessage({
      message: '密码由字母与数字组成',
      type: 'warning',
      plain: true,
    })
  }else if(!checkPassword(data.newUserForm.password, data.newUserForm.checkPass)){
    // 检查两次输入是否一致
    ElMessage({
      message: '两次输入密码不一致',
      type: 'warning',
      plain: true,
    })
  }else {
    const res = await createUser(data.newUserForm);
    //  输出新用户创建成功或失败提示
    if(res.status === 0){
      ElMessage({
        message: '新用户创建成功',
        type: 'success',
        plain: true,
      })
    } else {
      ElMessage({
        message: '新用户创建失败',
        type: 'error',
        plain: true,
      })
    }
    data.createUserModalVisible = false;
    searchUser();
  }
}
// 检查密码格式
const validatePassword = (password: string) => {
  let reg = /^[a-z|A-Z|0-9]*$/
  if(!reg.test(password)){
    return false;
  } else {
    return true;
  }
}
// 检查两次输入密码
const checkPassword = (newPassword: string, confirmPassword: string) => {
  if(confirmPassword != newPassword){
    return false;
  } else {
    return true;
  }
}
// 打开并初始化用户信息修改框
const openModifyUserModal = async (currentUserInfo: any) => {
  data.modifyUserModalVisible = true;
  const locationOptionsRes = await getLocationOption();
  data.locationOptions = locationOptionsRes.data;
  const res = await getUserDetail(currentUserInfo.id);
  data.currentUserId = currentUserInfo.id;
  data.currentUserForm.name = res.data.name;
  data.currentUserForm.email = res.data.email;
  data.currentUserForm.id_number = res.data.id_number;
  data.currentUserForm.phone = res.data.phone;
  data.currentUserForm.type = res.data.type;
  data.currentUserForm.user_name = res.data.user_name;
  data.currentUserForm.area_id = res.data.area_id;
  data.currentUserForm.idcard = res.data.idcard;
}
// 修改用户信息
const modifyUserInfo = async () => {
  const res = await editUserInfo(data.currentUserForm, data.currentUserId);
  //  输出用户信息修改成功或失败提示
  if(res.status === 0){
    ElMessage({
      message: '用户信息修改成功',
      type: 'success',
        plain: true,
    })
  } else {
    ElMessage({
      message: '用户信息修改失败',
      type: 'error',
      plain: true,
    })
  }
  data.modifyUserModalVisible = false;
  searchUser();
  searchTeacher();
  searchApplyList();
}

// 搜索教师列表
const searchTeacher = async () => {
  if(data.inputTeacherName.length > 0 || data.inputTeacherId.length > 0){
    data.teacherPage = 1;
  }
  const res = await getTeacherList(data.inputTeacherName, data.inputTeacherId, data.teacherPage, data.teacherCount);
  data.teacherList = res.data.list;
  data.teacherTotal = res.data.total;
}
// 教师分页
const teacherSizeChange = (val: any) => {
  searchTeacher();
}
const teacherCurrentChange = (val: any) => {
  data.teacherPage = val;
  searchTeacher();
}

// 搜索申请列表
const searchApplyList = async () => {
  if(data.inputRoleApllyId.length > 0){
    data.applyPage = 1;
  }
  const res = await getAllRoleApplyList(data.inputRoleApllyId, data.applyPage, data.applyCount);
  data.roleApplyList = res.data.list;
  data.applyTotal = res.data.total;
}
// 申请分页
const applySizeChange = (val: any) => {
  searchApplyList();
}
const applyCurrentChange = (val: any) => {
  data.applyPage = val;
  searchApplyList();
}
// 通过角色申请
const passRoleApply = async (currentRoleApply: any) => {
  const res = await evaluateRoleApply(currentRoleApply.id, 2);
  //  输出角色申请成功或失败提示
  if(res.status === 0){
    ElMessage({
      message: '已通过该申请',
      type: 'success',
        plain: true,
    })
  } else {
    ElMessage({
      message: '通过该申请失败',
      type: 'error',
        plain: true,
    })
  }
  searchApplyList();
}
// 拒绝角色申请
const rejectRoleApply = async (currentRoleApply: any) => {
  const res = await evaluateRoleApply(currentRoleApply.id, 3);
  //  输出角色申请成功或失败提示
  if(res.status === 0){
    ElMessage({
      message: '已拒绝该申请',
      type: 'success',
      plain: true,
    })
  } else {
    ElMessage({
      message: '拒绝申请失败',
      type: 'error',
      plain: true,
    })
  }
  searchApplyList();
}

onMounted(async () => {
  // 挂载信息
  searchUser();
  searchTeacher();
  searchApplyList();
  const res = await getLocationOption();
  data.locationOptions = res.data;
})
</script>

<template>
  <div class="manage-page">
    <el-tabs v-model="data.activeName" type="border-card" class="user-tabs">
      <!-- 用户管理 -->
      <el-tab-pane label="用户管理" name="first">
        <!-- 检索用户 -->
        <div class="manage-box">
          <div class="manage-title">用户管理</div>
          <div class="select-user">
            <!-- 搜索 -->
            <el-input v-model="data.inputUserId" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入ID号" />
            <el-input v-model="data.inputUserName" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入用户昵称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchUser()">搜索</el-button>
            <el-button type="primary" class="mr-3 h-[2rem]" @click="openCreateUserModal()">创建</el-button>
          </div>
        </div>
        <!-- 用户信息展示 -->
        <div class="user-list">
          <el-empty v-if="data.userList.length === 0" description="暂无用户信息" />
          <el-table v-if="data.userList.length !== 0" :data="data.userList" border style="width: 100%">
            <el-table-column prop="id_number" label="ID"/>
            <el-table-column prop="name" label="昵称"/>
            <el-table-column prop="phone" label="电话号码"/>
            <el-table-column prop="email" label="邮箱"/>
            <el-table-column prop="area_name" label="所属地区"/>
            <el-table-column fixed="right" label="操作" min-width="60">
              <template v-slot="scope">
                <el-button link type="primary" size="small" @click="openModifyUserModal(scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-if="data.userList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.userTotal" 
            :page-size="data.userCount"
            @size-change="userSizeChange"
            @current-change="userCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>

      <!-- 教师管理 -->
      <el-tab-pane label="教师管理" name="second">
        <!-- 检索用户 -->
        <div class="manage-box">
          <div class="manage-title">教师管理</div>
          <div class="select-user">
            <!-- 搜索 -->
            <el-input v-model="data.inputTeacherId" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入教师ID号" />
            <el-input v-model="data.inputTeacherName" class="mr-3 w-[20vw] h-[2rem]" placeholder="请输入教师昵称" />
            <el-button type="primary" class="mr-3 h-[2rem]" @click="searchTeacher()">搜索</el-button>
          </div>
        </div>
        <!-- 用户信息展示 -->
        <div class="user-list">
          <el-empty v-if="data.teacherList.length === 0" description="暂无教师信息"/>
          <el-table v-if="data.teacherList.length !== 0" :data="data.teacherList" border style="width: 100%">
            <el-table-column prop="id_number" label="ID"/>
            <el-table-column prop="name" label="昵称"/>
            <el-table-column prop="phone" label="电话号码"/>
            <el-table-column prop="email" label="邮箱"/>
            <el-table-column prop="area_name" label="所属地区"/>
          </el-table>
          <!-- 分页 -->
          <el-pagination 
            v-if="data.teacherList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.teacherTotal" 
            :page-size="data.teacherCount"
            @size-change="teacherSizeChange"
            @current-change="teacherCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>

      <!-- 角色申请管理 -->
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
          <el-empty v-if="data.roleApplyList.length === 0" description="暂无角色申请信息"/>
          <el-table v-if="data.roleApplyList.length !== 0" :data="data.roleApplyList" border style="width: 100%">
            <el-table-column prop="user_id_number" label="ID"/>
            <el-table-column prop="user_name" label="用户名"/>
            <el-table-column prop="new_type_desc" label="申请角色"/>
            <el-table-column prop="create_time" label="时间"/>
            <el-table-column prop="status_desc" label="审核状态"/>
            <el-table-column fixed="right" label="操作" min-width="60">
              <template v-slot="scope">
                <el-button v-if="scope.row.status === 1" link type="primary" size="small" @click="passRoleApply(scope.row)">通过</el-button>
                <el-button v-if="scope.row.status === 1" link type="primary" size="small" @click="rejectRoleApply(scope.row)">不通过</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            v-if="data.roleApplyList.length !== 0"
            background 
            layout="prev, pager, next"
            :total="data.applyTotal" 
            :page-size="data.applyCount"
            @size-change="applySizeChange"
            @current-change="applyCurrentChange"
            class="mt-4 mx-auto"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <!-- 创建用户框 -->
  <el-dialog v-model="data.createUserModalVisible" title="创建新用户" width="500" center>
    <div class="user-dialog">
      <el-form :model="data.newUserForm" label-width="auto" class="w-[25rem]">
        <!-- 昵称 -->
        <el-form-item label="昵称">
          <el-input 
            v-model="data.newUserForm.name" 
            placeholder="请输入昵称(不能超过20个字)"
            show-word-limit="true"
            maxlength="20"
          >
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="姓名">
          <el-input 
            v-model="data.newUserForm.user_name" 
            placeholder="请输入姓名(不能超过20个字)"
            show-word-limit="true"
            maxlength="20"
          >
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱">
          <el-input 
            v-model="data.newUserForm.email" 
            placeholder="请输入邮箱(不能超过30个字)"
            show-word-limit="true"
            maxlength="30"
          >
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机">
          <el-input v-model="data.newUserForm.phone" placeholder="请输入手机号码">
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Iphone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 角色 -->
        <el-form-item label="角色">
          <el-select
            v-model="data.newUserForm.type"
            placeholder="请选择角色"
            class="w-[25rem]"
          >
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Postcard />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.userRoleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <!-- 所属地区 -->
        <el-form-item label="地区">
          <el-cascader v-model="data.newUserForm.area_id" :options="data.locationOptions" :props="{ checkStrictly: true }" style="width:100%" clearable placeholder="请选择所属地区" >
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Location />
              </el-icon>
            </template>
          </el-cascader>
        </el-form-item>
        <!-- 身份证号码 -->
        <el-form-item label="身份">
          <el-input 
            v-model="data.newUserForm.idcard" 
            placeholder="请输入身份证号码(不能超过18个字)"
            show-word-limit="true"
            maxlength="18"
          >
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Aim />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码">
          <el-input v-model="data.newUserForm.password" placeholder="请输入密码">
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item label="确认密码">
          <el-input v-model="data.newUserForm.checkPass" placeholder="请确认密码">
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 创建按钮 -->
        <el-form-item>
          <el-button class="w-[25rem]" type="primary" @click="createNewUser()">创建用户</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

  <!-- 修改用户信息框 -->
  <el-dialog v-model="data.modifyUserModalVisible" title="修改用户信息" width="500" center>
    <div class="user-dialog">
      <el-form :model="data.currentUserForm" label-width="auto" class="w-[25rem]">
        <!-- 昵称 -->
        <el-form-item label="昵称">
          <el-input 
            v-model="data.currentUserForm.name" 
            placeholder="请输入昵称(不能超过20个字)"
            show-word-limit="true"
            maxlength="20"
          >
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="姓名">
          <el-input 
            v-model="data.currentUserForm.user_name" 
            placeholder="请输入姓名(不能超过20个字)"
            show-word-limit="true"
            maxlength="20"
          >
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 学号 -->
        <el-form-item label="ID">
          <el-input v-model="data.currentUserForm.id_number" placeholder="请输入ID" disabled>
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Star />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱">
          <el-input 
            v-model="data.currentUserForm.email" 
            placeholder="请输入邮箱(不能超过30个字)"
            show-word-limit="true"
            maxlength="30"
          >
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机">
          <el-input v-model="data.currentUserForm.phone" placeholder="请输入手机号码" disabled>
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Iphone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 角色 -->
        <el-form-item label="角色">
          <el-select
            v-model="data.currentUserForm.type"
            placeholder="请选择角色"
            class="w-[25rem]"
            disabled
          >
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Postcard />
              </el-icon>
            </template>
            <el-option
              v-for="item in data.userRoleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 所属地区 -->
        <el-form-item label="地区">
          <el-cascader v-model="data.currentUserForm.area_id" :options="data.locationOptions" style="width:100%" clearable placeholder="请选择所属地区">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Location />
              </el-icon>
            </template>
          </el-cascader>
        </el-form-item>
        <!-- 身份证号码 -->
        <el-form-item label="身份">
          <el-input 
            v-model="data.currentUserForm.idcard" 
            placeholder="请输入身份证号码(不能超过18个字)"
            show-word-limit="true"
            maxlength="18"
          >
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Aim />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 修改按钮 -->
        <el-form-item>
          <el-button class="w-[25rem]" type="primary" @click="modifyUserInfo()">修改用户信息</el-button>
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

.manage-box {
  height: 10vh;
  width: 100%;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  @apply flex flex-row items-center justify-center rounded-md;
}
.manage-title {
  position: absolute;
  left: 2rem;
  @apply text-2xl italic font-semibold text-light-50;
}
.user-list {
  @apply flex flex-col mt-4 mr-2;
}
/* 模态框 */
.user-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
