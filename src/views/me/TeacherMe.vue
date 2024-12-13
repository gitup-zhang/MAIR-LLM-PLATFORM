<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue"
import { User, Star, Message, Iphone, Aim, Location, House, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// 引入 User、System 状态
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'
import { getUserInfo, editUserInfo, getApplyRoleList, submitModifyPassword, applyRole } from '@/apis/user'

const userStore = useUserStore();
const systemStore = useSystemStore();
const data = reactive({
  // 申请新的身份类型
  newType: userStore.roleId,
  // 申请记录
  applicationList: [],
  // 用户修改密码
  modifyPassword: {
    oldPassword: '',
    newPassowrd: '',
    checkPassword: ''
  },
  page: 1,
  count: 10,
  total: 0
})
const { newType, applicationList, page, count, total } = toRefs(data)

// 用户信息表单
const userInfoForm = reactive({
  id: 0,
  user_name: '',
  id_number: '',
  name: '',
  email: '',
  phone: '',
  type: '',
  idcard: '',
  create_time: 0,
  modify_time: 0,
  area_id: 0
})
const { 
  id, 
  user_name, 
  id_number, 
  name, 
  email, 
  phone, 
  type, 
  idcard, 
  create_time,
  modify_time,
  area_id 
} = toRefs(userInfoForm)

// 角色类型
const userRoleOptions = ref([
  {
    value: 1,
    label: '学生',
    disabled: Number(sessionStorage.userType) >= 1
  },
  {
    value: 2,
    label: '教师',
    disabled: Number(sessionStorage.userType) >= 2
  },
  {
    value: 3,
    label: '教务',
    disabled: Number(sessionStorage.userType) >= 3
  }
])

// 获取用户类型
const getUserType = (userType: number) => {
  if (!userType){
    return '未知';
  } else if (userType === 1) {
    return '学生'
  } else if (userType === 2) {
    return '教师'
  } else {
    return '教务'
  }
}

// 获取用户信息，并存储到状态中
const getAndStoreUserData = async () => {
  // 获取用户数据
  const userData = await getUserInfo();
  userInfoForm.id = userData.data.id;
  userInfoForm.user_name = userData.data.user_name;
  userInfoForm.id_number = userData.data.id_number;
  userInfoForm.name = userData.data.name;
  userInfoForm.email = userData.data.email;
  userInfoForm.phone = userData.data.phone;
  userInfoForm.type = userData.data.type;
  userInfoForm.idcard = userData.data.idcard;
  userInfoForm.create_time = userData.data.create_time;
  userInfoForm.modify_time = userData.data.modify_time;
  userInfoForm.area_id = userData.data.area_id;

  userStore.id = userData.data.id;
  userStore.nickname = userData.data.user_name;
  userStore.stuId = userData.data.id_number;
  userStore.name = userData.data.name;
  userStore.avatar = '';
  userStore.email = userData.data.email;
  userStore.phone = userData.data.phone;
  userStore.role = getUserType(userData.data.type);
  userStore.personId = userData.data.idcard;
  userStore.createTime = userData.data.create_time;
  userStore.modifyTime = userData.data.modify_time;
  userStore.areaId = userData.data.area_id;
}

// 提交修改
const userInfoEditSubmit = async () => {
  const res = await editUserInfo(userInfoForm, userStore.id);
  if(res.status === 0){
    ElMessage({
      message: '修改成功',
      type: 'success',
      plain: true,
    })
    // 关闭模态框
    systemStore.userInfoEditVisible = false
    // 刷新数据
    getAndStoreUserData()
  } else {
    ElMessage({
      message: '修改失败',
      type: 'warning',
      plain: true,
    })
  }
}

// 提交角色修改
const submitRoleApply = async () => {
  const res = await applyRole(data.newType)
  if(res.status === 0){
    ElMessage({
      message: '申请成功',
      type: 'success',
      plain: true,
    })
    getUserApplyRoleList();
  } else {
    ElMessage({
      message: res.message,
      type: 'warning',
      plain: true,
    })
  }
  console.log(res)
}

// 获取角色申请记录列表
const getUserApplyRoleList = async () => {
  const res = await getApplyRoleList();
  data.applicationList = res.data.list;
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

// 提交密码修改
const submitPasswordModify = async () => {
  // 检查非空
  if(data.modifyPassword.oldPassword === '' || data.modifyPassword.newPassowrd === '' || data.modifyPassword.checkPassword ===''){
    ElMessage({
      message: '请输入密码',
      type: 'warning',
      plain: true,
    })
  }else if(!validatePassword(data.modifyPassword.oldPassword) || !validatePassword(data.modifyPassword.newPassowrd) || !validatePassword(data.modifyPassword.checkPassword)){
    // 检查类型
    ElMessage({
      message: '密码由字母与数字组成',
      type: 'warning',
      plain: true,
    })
  }else if(!checkPassword(data.modifyPassword.newPassowrd, data.modifyPassword.checkPassword)){
    // 检查两次输入是否一致
    ElMessage({
      message: '两次输入密码不一致',
      type: 'warning',
      plain: true,
    })
  }else {
    const newForm = {
      old_password: data.modifyPassword.oldPassword,
      new_password: data.modifyPassword.newPassowrd,
      check_password: data.modifyPassword.checkPassword
    }
    const res = await submitModifyPassword(newForm);
        // 输出密码修改成功或失败提示
        if(res.status === 0){
      ElMessage({
        message: '密码修改成功',
        type: 'success',
        plain: true,
      })
    } else {
      ElMessage({
        message: '密码修改失败',
        type: 'warning',
        plain: true,
      })
    }
  }
}

onMounted(() => {
  // 挂载用户数据
  getAndStoreUserData();
  // 获取角色申请记录列表
  getUserApplyRoleList();
})
</script>

<template>
  <div class="me-page">
    <div class="me-container">
      <!-- 顶部轮播图 -->
      <el-carousel indicator-position="outside">
        <el-carousel-item>
          <img src="../../assets/img/carousel/carousel-1.png" alt="大模型实训平台">
        </el-carousel-item>
        <el-carousel-item>
          <img src="../../assets/img/carousel/carousel-2.png" alt="大模型实训平台">
        </el-carousel-item>
        <el-carousel-item>
          <img src="../../assets/img/carousel/carousel-3.png" alt="大模型实训平台">
        </el-carousel-item>
        <el-carousel-item>
          <img src="../../assets/img/carousel/carousel-4.png" alt="大模型实训平台">
        </el-carousel-item>
      </el-carousel>
      <!-- 个人信息展示 -->
      <el-descriptions border>
        <el-descriptions-item
          :rowspan="2"
          :width="140"
          label="头像"
        >
          <!-- 头像照片 -->
          <el-image
            style="width: 100%; height: 100%;"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            @click="systemStore.openUserAvatarEditModal()"
          />
          <el-button type="primary" @click="systemStore.openUserInfoEditModal()">修改我的信息</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="用户名">{{ userStore.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userStore.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userStore.email }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ userStore.stuId }}</el-descriptions-item>
        <el-descriptions-item label="标签">
          <el-tag size="small">北京邮电大学</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="地址">西土城路10号, 海淀区, 北京市</el-descriptions-item>
      </el-descriptions>
      <el-row class="edit-info">
        <!-- 选择新角色 -->
        <el-col :span="8">
          <el-select v-model="data.newType" placeholder="请选择角色" style="width: 240px">
            <el-option
              v-for="item in userRoleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
          <el-button type="primary" class="ml-2" @click="submitRoleApply()">申请</el-button>
        </el-col>
        
        <!-- 密码修改 -->
        <el-col :span="16">
          <el-form :model="data.modifyPassword" class="w-[40rem] flex flex-row">
            <!-- 输入原密码 -->
            <el-form-item class="mr-1">
              <el-input type="password" v-model="data.modifyPassword.oldPassword" placeholder="请输入原始密码">
                <!-- 图标 -->
                <template #prefix>
                  <el-icon color="#409efc" class="no-inherit">
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <!-- 输入新密码 -->
            <el-form-item class="mr-1">
              <el-input type="password" v-model="data.modifyPassword.newPassowrd" placeholder="请输入新密码">
                <!-- 图标 -->
                <template #prefix>
                  <el-icon color="#409efc" class="no-inherit">
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <!-- 确认新密码 -->
            <el-form-item class="mr-1">
              <el-input type="password" v-model="data.modifyPassword.checkPassword" placeholder="请确认新密码">
                <!-- 图标 -->
                <template #prefix>
                  <el-icon color="#409efc" class="no-inherit">
                    <Lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <!-- 确认按钮 -->
            <el-form-item>
              <el-button class="w-[5rem]" type="primary" @click="submitPasswordModify()">确认修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 角色申请记录 -->
      <el-table :data="data.applicationList" border style="width: 100%">
        <el-table-column prop="user_id_number" label="号码" />
        <el-table-column prop="user_name" label="昵称"/>
        <el-table-column prop="new_type_desc" label="申请角色"/>
        <el-table-column prop="create_time" label="时间"/>
        <el-table-column prop="status_desc" label="审核状态"/>
      </el-table>
    </div>
  </div>

  <!-- 修改个人信息框 -->
  <el-dialog v-model="systemStore.userInfoEditVisible" title="修改个人信息" width="400" center>
    <div class="edit-dialog">
      <el-form :model="userInfoForm" class="w-[20rem]">
        <!-- 昵称 -->
        <el-form-item>
          <el-input v-model="userInfoForm.name" placeholder="请输入昵称">
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 学号 -->
        <el-form-item>
          <el-input v-model="userInfoForm.id_number" placeholder="请输入学号" disabled>
          <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Star />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item>
          <el-input v-model="userInfoForm.email" placeholder="请输入邮箱">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 手机号 -->
        <el-form-item>
          <el-input v-model="userInfoForm.phone" placeholder="请输入手机号">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Iphone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 角色 -->
        <el-form-item>
          <el-input v-model="userInfoForm.type" placeholder="角色" disabled>
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Aim />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 真实姓名 -->
        <el-form-item>
          <el-input v-model="userInfoForm.user_name" placeholder="请输入真实姓名">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 所属地区 -->
        <el-form-item>
          <el-input v-model="userInfoForm.area_id" placeholder="请输入您的所属地区">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <Location />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 所属地区 -->
        <el-form-item>
          <el-input v-model="userInfoForm.idcard" placeholder="请输入您的身份证号">
            <!-- 图标 -->
            <template #prefix>
              <el-icon color="#409efc" class="no-inherit">
                <House />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="w-[20rem]" type="primary" @click="userInfoEditSubmit()">提交修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 整体页面设置 */
.me-page {
  width: 100%;
  height: 100%;
  @apply bg-light-500;
}
.me-container {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-3 rounded-md;
}
.edit-info {
  @apply mt-3;
}
/* 模态框 */
.edit-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
