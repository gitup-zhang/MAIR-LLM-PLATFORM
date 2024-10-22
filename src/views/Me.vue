<script setup lang="ts">
import { ref } from "vue"
import { RouterLink, useRouter } from "vue-router"
import { User, Star, Message, Iphone, Aim, Location, House } from '@element-plus/icons-vue'
// 引入 User、System 状态
import { useUserStore } from '@/stores/user'
import { useSystemStore } from '@/stores/system'

const userStore = useUserStore();
const systemStore = useSystemStore();

// 获取用户类型
const getUserTypeName = () => {
  if (!userStore.userType){
    return '未知';
  } else if (userStore.userType === '1') {
    return '学生'
  } else if (userStore.userType === '2') {
    return '教师'
  } else {
    return '教务'
  }
}
// 角色类型
const userRoleOptions = ref([
  {
    value: '学生',
    label: '学生'
  },
  {
    value: '教务',
    label: '教务'
  },
  {
    value: '教师',
    label: '教师'
  },
])






// 个人信息表单
const userInfoForm = ref({
  nickname: 'stuZhang',
  stuId:'2023110765',
  email:'zhangSan@163.com',
  phone: '16322377655',
  role: '学生',
  name: '张三',
  location: '北京邮电大学',
  personId:'110101200104157756'
})

const myRole = ref('')
const applyData = ref([
  {
    id: '1',
    role: '教师',
    time: '无',
    status: '待审核',
    operation: '操作'
  },
  {
    id: '2',
    role: '教师',
    time: '无',
    status: '待审核',
    operation: '操作'
  },
])

// 用户信息修改提交
const userInfoEditSubmit = () => {

}

</script>

<template>
  <el-row class="me-page">
    <el-col :lg="20" class="left-main">
      <div class="me-container">
        <!-- 个人信息展示 -->
        <el-descriptions border>
          <el-descriptions-item
          :rowspan="2"
          :width="140"
          label="头像"
          align="center"
          >
            <!-- 头像照片 -->
            <el-image
              style="width: 100px; height: 100px"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              @click="systemStore.openUserAvatarEditModal()"
            />
            <el-button type="primary" @click="systemStore.openUserInfoEditModal()">修改我的信息</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="用户名">张三</el-descriptions-item>
          <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
          <el-descriptions-item label="地点">北京</el-descriptions-item>
          <el-descriptions-item label="标签">
            <el-tag size="small">北京邮电大学</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="地址">西土城路10号, 海淀区, 北京市</el-descriptions-item>
        </el-descriptions>

        <!-- 角色申请记录 -->
        <el-row class="role-apply">
          <el-col :span="12" class="role-apply-display">
            <el-select v-model="myRole" placeholder="请选择角色" style="width: 240px" class="mb-3 mr-2">
              <el-option
                v-for="item in userRoleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button type="primary" class="mb-3">申请</el-button>
            <!-- 角色申请记录 -->
            <el-table :data="applyData" border style="width: 100%">
              <el-table-column prop="id" label="学号" width="60" />
              <el-table-column prop="role" label="申请角色"/>
              <el-table-column prop="time" label="时间"/>
              <el-table-column prop="status" label="审核状态"/>
              <el-table-column prop="operation" label="操作" />
            </el-table>
          </el-col>
          <el-col :span="12">

          </el-col>
        </el-row>

      </div>
    </el-col>

    <!-- 右侧 用户信息区 -->
    <el-col :lg="4" class="right-main">
      <div class="username">
        欢迎 {{ userStore.name }} 用户登录
      </div>
      <div class="usertype">
        类型：{{ getUserTypeName() }}
      </div>
      <!-- 用户信息概览 -->
      <el-row class="overview">
        <!-- 课程数量信息概览 -->
        <el-col :span="8">
          <div class="overview-title">
            课程数量
          </div>
          <div class="overview-content">
            <!-- 图标 -->
            <el-icon class="no-inherit text-sky-600">
              <DataBoard />
            </el-icon>
            8
          </div>
        </el-col>

        <!-- 实验数量信息概览 -->
        <el-col  :span="8">
          <div class="overview-title">
            实验次数
          </div>
          <div class="overview-content">
            <!-- 图标 -->
            <el-icon class="no-inherit text-sky-600">
              <SetUp />
            </el-icon>
            3
          </div>
        </el-col>

          <el-col  :span="8" class="overview-title">
            <div class="overview-title">
              考试数量
            </div>
            <div class="overview-content">
              <!-- 图标 -->
              <el-icon class="no-inherit text-sky-600">
                <Document />
              </el-icon>
              2
            </div>
          </el-col>
        </el-row>
        <!-- 与大模型对话按钮 -->
        <el-button type="primary" class="font-bold">与大模型对话</el-button>
    </el-col>
  </el-row>

  <!-- 修改头像框 -->
  <el-dialog v-model="systemStore.userAvatarEditVisible" title="修改个人信息" width="400">
  </el-dialog>

  <!-- 修改个人信息框 -->
  <el-dialog v-model="systemStore.userInfoEditVisible" title="修改个人信息" width="400">
    <div class="edit-dialog">
      <el-form :model="userInfoForm" class="w-[20rem]">
        
        <!-- 昵称 -->
        <el-form-item>
          <el-input v-model="userInfoForm.nickname" placeholder="请输入昵称">
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
          <el-input v-model="userInfoForm.stuId" placeholder="请输入学号" disabled>
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
          <el-input v-model="userInfoForm.role" placeholder="角色" disabled>
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
          <el-input v-model="userInfoForm.name" placeholder="请输入真实姓名">
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
          <el-input v-model="userInfoForm.location" placeholder="请输入您的所属地区">
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
          <el-input v-model="userInfoForm.personId" placeholder="请输入您的身份证号">
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
          <el-button class="w-[20rem]" type="primary" @click="userInfoEditSubmit">提交修改</el-button>
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
}
/* 左侧区域 */
.left-main {
  width: 100%;
  height: 100%;
  @apply bg-light-500 pr-1;
}
.me-container {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-light-50 p-3 rounded-md;
}
.role-apply {
  width: 100%;
  @apply mt-3;
}
.role-apply-display {
  @apply pr-2;
}
/* 右侧区域 */
.right-main {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 2px #d1d5db;
  @apply bg-sky-50 flex flex-col p-3 rounded-md;
}
.username {
  @apply text-xl font-semibold text-sky-400;
}
.usertype {
  @apply text-base text-sky-400;
}
.overview {
  width: 100%;
  @apply mt-3 mb-3;
}
.overview-title {
  @apply text-sky-400 text-sm ;
}
.overview-content{
  @apply text-sky-600 text-xl;
}
/* 模态框 */
.edit-dialog {
  @apply flex items-center justify-center flex-col;
}
</style>
